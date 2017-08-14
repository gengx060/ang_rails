class WelcomeController < ApplicationController
  def index
    # render file: Rails.public_path.join("templates","home.html"), layout: true
    render file: "../assets/javascripts/index.html", layout: true
  end

  def ajax
    render json:'sucess:1', layout: false
  end
end
