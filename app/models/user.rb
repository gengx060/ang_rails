class User < ActiveRecord::Base

	# validates_presence_of :email
	# self.table_name = "users"
	# attr_accessor :firstname, :lastname, :email

	# def self.create(params)
	# 	contact = self.new do |u|
	# 		u.firstname = params[:firstname]
	# 		u.lastname = params[:lastname]
	# 		u.email = params[:email]
	# 		if params[:account] # create org account
	# 			salt, hashed = create_password_salt(params[:password])
	# 			u.salt = salt
	# 			u.password = hashed
	# 		else # add contact
	# 			u.group = params[:group]
	# 			u.org_id = params[:user_id]
	# 		end
	# 	end
	# 	contact.save!
	# 	if params[:account]
	# 		contact.org_id = contact.id
	# 		contact.group = 'o'
	# 		contact.save!
	# 		return contact
	# 	end
	# end

	def self.edit(params)
		if params[:id]
			user = self.where("id = #{params[:id]}").first
		end

		unless user
			user = self.new
		end
		if user
			self.params_to_model(params, user)
			user.save!
			if (params[:group] == 'o')
				user.org_id = user.id
				user.save!
			end
		end
		return user
	end

	def self.login_profile(user_id)
		user = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
							 .joins("LEFT JOIN `user_logins` as ul ON ul.user_id = users.id")
							 .select("users.id, firstname, lastname, email, up.img_loc, ul.created_at")
							 .where("users.id = #{user_id} and ul.status='login' and (users.is_deleted is NULL or users.is_deleted=0)")
							 .order("ul.created_at DESC")
							 .first
		return user
	end

#
# 	def self.user_list(org_id, offset, limit)
# 		total = User.where(:org_id => org_id).count
# 		users = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
# 					.joins("LEFT JOIN `user_logins` as ul ON ul.user_id = users.id")
# 					.select("users.id, firstname, lastname, email, users.is_deleted,
# users.group,  users.created_at, up.img_loc, MAX(ul.login_at) as login_at")
# 					.where("users.org_id = #{org_id}")
# 					.group("users.id")
# 					.offset(offset).limit(limit)
# 		return total, users
# 	end

	def self.user_list(params)
		total = User.where(:org_id => params[:org_id]).count
		users = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
								.joins("LEFT JOIN `user_logins` as ul ON ul.user_id = users.id and ul.status = 'login'")
								.select("users.id, firstname, lastname, email, users.is_deleted,
users.group,  users.created_at, up.img_loc, MAX(ul.created_at) as login_at")
								.where("users.org_id = #{params[:org_id]}")
								.group("users.id")
								.order(params[:sortby])
								.offset(params[:offset]).limit(params[:limit])
		return total, users
	end

	def self.get_user(user_id, org_id)
		user = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
							 .where("users.id = #{user_id} and users.org_id = #{org_id}")
							 .select("users.id, firstname, lastname, email, users.group")
							 .first
		return user
	end

	def self.create_password_salt(password)
		require 'securerandom'
		salt = SecureRandom.hex(5)
		require 'digest'
		# hashed = HMAC::SHA512.hexdigest('site_salt', "#{password} salt")
		hashed = Digest::SHA512.hexdigest("#{password} #{salt}")
		return salt, hashed
	end
end
