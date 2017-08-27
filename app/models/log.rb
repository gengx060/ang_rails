class Log < ActiveRecord::Base

	def self.create(params)
		log = Log.new do |e|
			e.table = params[:table]
			e.event = params[:event]
			e.user_id = params[:user_id]
			e.event = params[:event]
			e.org_id = params[:org_id]
			e.table_id = params[:table_id]
			e.created_at = params[:created_at]
			e.created_at = Time.now
		end
		log.save!
	end

end
