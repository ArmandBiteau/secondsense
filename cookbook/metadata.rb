name 'secondsense'
maintainer 'Armand Biteau'
maintainer_email 'armandbiteau@gmail.com'
description 'Vagrant box for secondsense VR Game'
version '0.0.1'

recipe 'secondsense', 'Mon cookbook perso'

depends 'apt'
depends 'nvm'
depends 'nginx'
depends 'php'

%W{ debian ubuntu }.each do |os|
supports os
end
