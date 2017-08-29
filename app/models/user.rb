class User < ActiveRecord::Base

	# validates_presence_of :email
	# self.table_name = "users"
	# attr_accessor :firstname, :lastname, :email

	def self.create(params)
		user = self.new do |u|
			u.firstname = params[:firstname]
			u.lastname = params[:lastname]
			u.email = params[:email]
			if params[:account] # create org account
				salt, hashed = create_password_salt(params[:password])
				u.salt = salt
				u.password = hashed
			else # add contact
				u.group = params[:group]
				u.org_id = params[:user_id]
			end
		end
		user.save!
		if params[:account]
			user.org_id = user.id
			user.group = 'o'
			user.save!
			return user
		end
	end

	def self.login_profile(user_id)
		user = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
							 .joins("LEFT JOIN `user_logins` as ul ON ul.user_id = users.id")
							 .select("users.id, firstname, lastname, email, up.img_loc, ul.login_at")
							 .where("users.id = #{user_id} and  (users.is_deleted is NULL or users.is_deleted=0)")
							 .order("ul.login_at DESC")
							 .first
		return user
	end

	def self.user_list(org_id, offset, limit)
		total = User.where(:org_id => org_id).count
		users = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
								.joins("LEFT JOIN `user_logins` as ul ON ul.user_id = users.id")
								.select("users.id, firstname, lastname, email, users.is_deleted,
users.group,  users.created_at, up.img_loc, MAX(ul.login_at) as login_at")
								.where("users.org_id = #{org_id}")
								.group("users.id")
								.offset(offset).limit(limit)
		return total, users
	end

	def self.get_user(user_id, org_id)
		user = User.joins("LEFT JOIN `user_profiles` as up ON up.user_id = users.id")
							 .where("users.id = #{user_id} and users.org_id = #{org_id}")
							 .select("users.id, firstname, lastname, email")
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
