class User < ActiveRecord::Base

	# validates_presence_of :email
	# self.table_name = "users"
	# attr_accessor :firstname, :lastname, :email

	# def initialize(params)
	#
	# 	self.firstname = params[:firstname]
	# 	self.lastname = params[:lastname]
	# 	self.email = params[:email]
	# 	self.save!
	# 	return self
	# end

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

end
