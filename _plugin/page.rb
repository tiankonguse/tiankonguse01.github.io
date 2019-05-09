module Jekyll

  class Page
    attr_accessor :name

    def full_path_to_source
      File.join(@base, @dir, @name)
    end

    def absolute_url
      "#{@dir}#{url}"
    end
  end

end