function rvm --description "Ruby Version Manager"
  exec bash --login -c "rvm $argv; exec fish"
end
