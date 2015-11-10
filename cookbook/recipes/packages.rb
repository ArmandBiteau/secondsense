include_recipe 'apt'

# Pour chaque paquet on l'installe (apt-get install [paquet])
node['secondsense']['packages'].each do |a_package|
  package a_package
end
