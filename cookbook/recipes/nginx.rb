include_recipe "nginx"

# On utilise notre template
template '/etc/nginx/sites-available/secondsense' do
  source 'nginx/secondsense'
end

nginx_site 'secondsense' do
  enable true
  notifies :restart, 'service[nginx]'
end

# J'ai un bug avec le restart mais stop/start fonctionne bien :)
service 'php5-fpm' do
  action :stop
  action :start
end
