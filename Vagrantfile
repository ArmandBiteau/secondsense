# -*- mode: ruby -*-
# vi: set ft=ruby :

ip_address = '192.168.33.10'

project_name = 'secondsense'

Vagrant.configure(2) do |config|

  config.vm.box = 'debian/jessie64'

  # Vagrant va chercher sur l'url officielle de base mais c'est ici que vous pouvez mettre des box custom
  config.vm.box_url = 'debian/jessie64'

  # Le répertoire partagé
  config.vm.synced_folder './public', '/var/www/secondsense/', :mount_options => ['dmode=777', 'fmode=666']

  config.vm.provider 'virtualbox' do |vb|

    vb.gui = false

   # Mettez max 1/4 de votre ram au cas où, plus pourrait nuire à votre système
    vb.memory = '1024'
  end

  # Activation de berkshelf
  config.berkshelf.enabled = true

  # Configuration du host manager
  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true

  # Setup de l'ip par rapport aux paramètres globaux
  config.vm.hostname = project_name + '.local'
  config.vm.network :private_network, ip: ip_address
  config.hostmanager.aliases = [ "www." + project_name + ".local" ]

  config.vm.provision :hostmanager

  # Enfin notre configuration chef pour les recettes !
  config.vm.provision :chef_solo do |chef|

    chef.add_recipe 'apt'
    chef.add_recipe 'build-essential'
    chef.add_recipe 'secondsense::packages'
    chef.add_recipe 'secondsense::nodejs'
    chef.add_recipe 'secondsense::php'
    chef.add_recipe 'secondsense::nginx'

    chef.json = {
      :secondsense => {
        :packages => %W{ vim git curl httpie jq }, # Mettez ceux que vous voulez :)
        :npm_packages => %W{ socket.io }
      },
      :php => {
        :directives => {
          'date.timezone' => 'Europe/Paris'
        },
        :fpm_user => 'vagrant',
        :fpm_group => 'vagrant'
      },
      :nginx => {
        :user => 'vagrant',
        :default_site_enabled => false,
        :sendfile => 'off' # à cause d'un bug de VirtualBox
      }
    }
  end
end
