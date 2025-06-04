ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.
require 'yaml'
YAML::ENGINE.yamler = 'psych' if defined?(YAML::ENGINE)
if defined?(Psych) && Psych.respond_to?(:load)
  module Psych
    class << self
      alias_method :old_load, :load
      def load(yaml, *args)
        old_load(yaml, *args, aliases: true)
      end
    end
  end
end
