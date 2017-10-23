class User < ActiveRecord::Base
	has_many :user_tags, -> { where is_deleted: nil }
	has_many :tags, :through => :user_tags
	has_many :user_profiles

	def self.edit(params)
		if params[:id]
			user = self.where("id = ?", params[:id]).first
		end

		unless user
			user = self.new
		end
		if user
			self.params_to_model(params, user)
			user.save!
			if params[:type] == 'o'
				user.org_id = user.id
				user.save!
			end
		end
		return user
	end

	def self.login_profile(user_id)
		user = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
				   .joins("LEFT JOIN `user_logins` as ul ON ul.user_id = users.id")
				   .select("users.id, firstname, lastname, email, up.img_loc, ul.created_at,
					(select count(*) from user_notifications where user_id = 8 and is_read IS NULL) as msgCount")
				   .where("users.id = ? and ul.status='login' and (users.is_deleted is NULL or users.is_deleted=0)", user_id)
				   .order("ul.created_at DESC")
				   .first
		return user
	end

	def self.user_list(params)
		where_clause = "users.org_id = #{params[:org_id]} AND users.is_deleted IS NULL "
		if params[:filterbyids]
			where_clause += " AND users.id  in (#{params[:filterbyids]}) "
		end
		if !params[:tag].blank?
			total = UserTag.where("org_id = #{params[:org_id]} AND tag_id IN (#{params[:tag]}) AND is_deleted IS NULL").count
			tag_clause = "INNER JOIN user_tags ut ON users.id = ut.user_id AND ut.tag_id IN (#{params[:tag]}) AND ut.is_deleted IS NULL"
		else
			total = self.where(where_clause).count
		end
		users = self.select("users.id, firstname, lastname, email, users.is_deleted,
						users.type,  users.created_at,
						(select img_loc from `user_profiles` as up where up.user_id = users.id) as img_loc,
						(select MAX(ul.created_at) from `user_logins` as ul
							where ul.user_id = users.id and ul.status = 'login') as login_at
						")
					.joins(tag_clause)
					.where(where_clause)
					.order(params[:sortby])
					.offset(params[:offset]).limit(params[:limit])
		return total, users
	end

	def self.get_user(user_id, org_id)
		# .joins("LEFT JOIN `user_addresses` as ua ON ua.user_id = users.id")
		# .joins("LEFT JOIN `user_phones` as up ON up.user_id = users.id")
		user = self.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
				   .where("users.id = ? and users.org_id = ?", user_id, org_id)
				   .select("users.id, firstname, lastname, email, users.type")
				   .first
		return user
	end

	def self.get_vcard(user_id)
		vcard = self.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
					.joins("LEFT JOIN `user_tags` as ut ON ut.user_id = users.id AND ut.is_deleted IS NULL")
					.select("users.id, firstname, lastname, email, users.created_at, up.img_loc")
					.where("users.id = ?", user_id).first
		# user =  self.where("id = ?",user_id).select("id, firstname, lastname, email, created_at").first.as_json
		# user['img_loc'] =  self.find(user_id).user_profiles.select("img_loc").as_json
		# user['tags'] = self.find(11).tags.select("name").as_json.join(',')
		# return user
		return vcard
	end

	def self.create_password_salt(password)
		require 'securerandom'
		salt = SecureRandom.hex(5)
		require 'digest'
		# hashed = HMAC::SHA512.hexdigest('site_salt', "#{password} salt")
		hashed = Digest::SHA512.hexdigest("#{password} #{salt}")
		return salt, hashed
	end

	def self.user_search(param)
		if param[:term].length > 1
			lastname  = param[:term].split(' ', 2)[1]
			firstname = param[:term].split(' ', 2)[0]
			searches  = [
				"(SELECT id, firstname, lastname, email -- , 'fa-user' AS type1
						FROM users WHERE email LIKE ('%#{param[:term]}%') and org_id = #{param[:org_id]} LIMIT 3)"]
			if lastname
				searches.push(
					" UNION (SELECT id, firstname, lastname, email -- , 'fa-user' AS type1
								FROM users WHERE firstname LIKE ('%#{firstname}%') and lastname LIKE ('%#{lastname}%')
 and org_id = #{param[:org_id]} LIMIT 3)")

			else
				searches.push(
					" UNION (SELECT id, firstname, lastname, email -- , 'fa-user' AS type1
								FROM users WHERE firstname LIKE ('%#{param[:term]}%') and org_id = #{param[:org_id]} LIMIT 3)",
					" UNION (SELECT id, firstname, lastname, email -- , 'fa-user' AS type1
								FROM users WHERE lastname LIKE ('%#{param[:term]}%') and org_id = #{param[:org_id]} LIMIT 3)",
					" UNION (SELECT id, firstname, lastname, email -- , 'fa-user' AS type1
								FROM users WHERE id = \"#{param[:term]}\" and org_id = #{param[:org_id]} LIMIT 3)")
			end
			sql = "SELECT * FROM (
#{searches.join(' ')}
) AS t
LIMIT 12
"
			return self.find_by_sql(sql)
		end
	end

	def self.change_password(params)
		if params[:hash] && params[:password]
			userhash = UserHash.where("user_hash = ? and claimed is null", params[:hash]).first
			if userhash
				diff = (Time.now - userhash.created_at)/60
				if diff > 30
					return false, 'Password link is too old!'
				end
				user = self.find(userhash.user_id)
				if user
					self.transaction do
						salt, hashed  = self.create_password_salt(params[:password])
						user.password = hashed
						user.salt     = salt
						user.save!
						userhash.claimed = "\1"
						userhash.save!
						params = {
							email:        user.email,
							emailSubject: "Your password is changed",
							username:     "#{user.firstname}, #{user.lastname}",
							password:     params[:password]
						}
						Notifier.change_password(params).deliver_later
					end
					return true
				end
			end
			return false, 'Invalid password link!'
		end
	end

	def self.forget_password(params)
		userhashcreated_at = UserHash.where("user_ip = ?", params[:user_ip]).maximum('created_at')
		if userhashcreated_at
			diff = (Time.now - userhashcreated_at)/60
			if diff < 10 # each ip can only forget password once per 10 mins
				return false, 'Too many attempts, please try again later.'
			end
		end
		if params[:email]
			user = self.where("email = ?", params[:email]).first
			if user
				self.transaction do
					hashed   = Digest::SHA512.hexdigest("#{params[:email]} #{Time.now}")
					params_u = {
						user_id:    user.id,
						user_hash:  hashed,
						created_by: user.id,
						user_ip:    params[:user_ip]
					}
					UserHash.create_user_hash(params_u)
					params = {
						email:        user.email,
						emailSubject: "Reset your password",
						username:     "#{user.firstname}, #{user.lastname}",
						link:         "https://kevgeng.herokuapp.com/#!/login?changepassword=true&hash=#{hashed}"
					}
					Notifier.forget_password(params).deliver_later
				end
				return true
			end
		end
		return false, 'No record found!'
	end

	def self.create_contact(params)
		if self.exists?(email: params[:email], is_deleted: nil)
			return false, 'Duplicate email found.'
		else
			self.transaction do
				if params[:password]
					salt, hashed = User.create_password_salt(params[:password])
				end
				params_u = {
					'firstname': params[:firstname],
					'lastname':  params[:lastname],
					'email':     params[:email],
					'salt':      salt,
					'password':  hashed,
					'type':     params[:type],
					'org_id':    params[:org_id]
				}
				user     = self.edit(params_u)
				params_u = {
					'user_id':  user.id,
					'address2': params[:address][:apt],
					'address1': params[:address][:street],
					'city':     params[:address][:city],
					'state':    params[:address][:state],
					'country':  params[:address][:country] || 'US',
					'zipcode':  params[:address][:zipcode],
				}
				UserAddress.edit(params_u)
				params_u = {
					'user_id': user.id,
					'area':    params[:phone][:area],
					'number':  params[:phone][:number],
					'ext':     params[:phone][:ext]
				}
				UserPhone.edit(params_u)
			end
			return true
		end
	end

	def self.org_seat_count(params)
		self.where("org_id= #{params[:org_id]} AND is_deleted IS NULL").count
	end
end
