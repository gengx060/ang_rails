class WelcomeController < ApplicationController
  before_action :check_auth, :except => ["index", "check_auth"]

  def index
    # render file: Rails.public_path.join("templates","home.html"), layout: true
    render file: "../assets/javascripts/index.html", layout: true
  end

  def ajax
    # render text:'sucess:1', layout: false
    render :json => { :success => true,:product => {s:1}.as_json() }
  end
end
