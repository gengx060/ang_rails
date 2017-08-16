class AccountController < ApplicationController
  def new_user
    render :json => { :success => true,:product => {s:1}.as_json() }
  end
end
