class AccountController < ApplicationController
  def new_user
    if User.exists?(email: params['email'])
      render :json => { :error => 'Duplicate email found.' }, :status => 500
    else
      user = User.new do |u|
        u.firstname = params['firstname']
        u.lastname = params['lastname']
        u.email = params['email']
        salt, hashed = create_password_salt('gege1818')
        u.salt = salt
        u.password = hashed
      end
      user.save!
      render :json => { :success => true,:product => {s:1}.as_json() }
    end
  end

  def create_password_salt(password)
    require 'securerandom'
    salt = SecureRandom.hex(5)
    require 'digest'
    # hashed = HMAC::SHA512.hexdigest('site_salt', "#{password} salt")
    hashed = Digest::SHA512.hexdigest("#{password} #{salt}")
    return salt, hashed
  end
end
