class User < ActiveRecord::Base

	validates_presence_of :email
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


end
