class SettingController < ApplicationController

	def save_preference

		params[:preferences].each {|p|
			params_u = {
					user_id: session[:user_id],
					org_id:  session[:org_id],
					name:    p[:name],
					value:   p[:value]
			}
			UserPreference.edit(params_u)
		}

		render :json => {}
	end

	def get_preference
		pref = UserPreference.where("user_id = #{session[:user_id]} and org_id = #{session[:org_id]}")
							 .select('distinct name, value').all
		unless pref
			pref = [{name: 'pagesize', value: 20}, {name: 'timezone', value: 'America/New_York'}, {name: 'loginpage', value: 'Welcome'}]
		end
		render :json => pref.as_json
	end

end
