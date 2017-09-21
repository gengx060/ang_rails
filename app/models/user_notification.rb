class UserNotification < ActiveRecord::Base

	def self.edit(params)
		en       = self.new
		params_u = {
				user_id:    params[:user_id],
				event_table: params[:event_table],
				event_id:   params[:event_id],
				event_detail:   params[:event_detail],
				created_by:   params[:created_by],
		}
		self.params_to_model(params_u, en)
		en.save!
	end

	def self.read(params)
		en = self.find(params[:id])
		if en
			en.is_read = "\1"
			en.save!
		end
	end
end
