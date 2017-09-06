class UserLogin < ActiveRecord::Base

	def self.record(params)
		user_login = self.new do |ul|
			ul.user_id    = params[:user_id]
			ul.user_ip    = params[:user_ip]
			ul.login_from = params[:user_agent]
			ul.status = params[:status]
		end
		user_login.save!
	end

	def self.latest_login(user_id)
		return self.where("user_id = #{user_id} and status = 'login'")
			.maximum('created_at')
	end
end
