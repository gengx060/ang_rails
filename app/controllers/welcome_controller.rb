class WelcomeController < ApplicationController
  before_action :check_auth, :except => ["index", "check_auth"]

  def index
    render file: "../assets/javascripts/index.html", layout: true
  end

  def ajax
    render :json => { :success => true,:product => {s:1}.as_json() }
  end

end
