module Jekyll

  class Post
    attr_accessor :name

    def full_path_to_source
      File.join(@base, @name)
    end

    def absolute_url
      "#{url}"
    end
  end
  
end