require 'bundler/gem_tasks'
require 'rspec/core/rake_task'

system 'bundle'
system "gem build modalist.gemspec"


RSpec::Core::RakeTask.new

task default: :spec
