Rails.application.routes.draw do

  get 'account/new_user'

  # get 'auth/login'

  root 'welcome#index'
  get '/welcome/ajax' => 'welcome#ajax'
  get '/welcome/test' => 'welcome#test'
  get '/resource/preview'
  post '/welcome/ajax' => 'welcome#ajax'
  post '/auth/login' => 'auth#login'
  post '/welcome/test' => 'welcome#test'


  id_requirement     = /\d+/
  action_requirement = /[A-Za-z_]\S*/
  post '/:controller/:action', :action => 'list', :requirements => { :action => action_requirement }
  # match '/:controller/:id/:action', :action => 'show', :requirements => { :id => id_requirement, :action => action_requirement }


  # get '/asset', to: redirect('/assets')
  # map.connect '/', :controller => "auth", :action=>"login"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'asset/*' => '/assets/asset/*'
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
