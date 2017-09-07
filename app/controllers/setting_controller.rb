class SettingController < ApplicationController

  def save_preference
    UserPreference.edit(params)

    render :json => {}
  end

end
