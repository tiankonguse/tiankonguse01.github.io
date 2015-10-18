{% assign post0 = 0 %}
{% assign post0Weight = -1 %}
{% assign post1 = 0 %}
{% assign post1Weight = -1 %}
{% assign post2 = 0 %}
{% assign post2Weight = -1 %}
{% assign post3 = 0 %}
{% assign post3Weight = -1 %}
{% assign post4 = 0 %}
{% assign post4Weight = -1 %}
{% assign post5 = 0 %}
{% assign post5Weight = -1 %}
{% assign post6 = 0 %}
{% assign post6Weight = -1 %}
{% assign post7 = 0 %}
{% assign post7Weight = -1 %}
{% assign post8 = 0 %}
{% assign post8Weight = -1 %}
{% assign post9 = 0 %}
{% assign post9Weight = -1 %}
{% assign post10 = 0 %}
{% assign post10Weight = -1 %}
{% assign postTmp = 0 %}
{% assign postTmpWeight = -1 %}


{% for post in site.posts %}
    {% assign post10Weight = -2 %}
    {% assign post10 = post %}
    
    {% if post.id != nowPost.id %}
        {% assign post10Weight = 0 %}
        {% for tag in post.tags %}
            {% if nowPost.tags contains tag %}
                {% assign post10Weight = post10Weight | plus:1 %}
            {% endif %}
        {% endfor %}
        
        {% for category in post.categories %}
            {% if nowPost.categories contains category %}
                {% assign post10Weight = post10Weight | plus:2 %}
            {% endif %}
        {% endfor %}
    {% endif %}
    
    {% if post10Weight >= post9Weight %}
        {% assign postTmp = post9 %}
        {% assign postTmpWeight = post9Weight %}
        
        {% assign post9 = post10 %}
        {% assign post9Weight = post10Weight %}
        
        {% assign post10 = postTmp %}
        {% assign post10Weight = postTmpWeight %}
    {% endif %}
    {% if post9Weight >= post8Weight %}
        {% assign postTmp = post8 %}
        {% assign postTmpWeight = post8Weight %}
        
        {% assign post8 = post9 %}
        {% assign post8Weight = post9Weight %}
        
        {% assign post9 = postTmp %}
        {% assign post9Weight = postTmpWeight %}
    {% endif %}
    {% if post8Weight >= post7Weight %}
        {% assign postTmp = post7 %}
        {% assign postTmpWeight = post7Weight %}
        
        {% assign post7 = post8 %}
        {% assign post7Weight = post8Weight %}
        
        {% assign post8 = postTmp %}
        {% assign post8Weight = postTmpWeight %}
    {% endif %}
    {% if post7Weight >= post6Weight %}
        {% assign postTmp = post6 %}
        {% assign postTmpWeight = post6Weight %}
        
        {% assign post6 = post7 %}
        {% assign post6Weight = post7Weight %}
        
        {% assign post7 = postTmp %}
        {% assign post7Weight = postTmpWeight %}
    {% endif %}
    {% if post6Weight >= post5Weight %}
        {% assign postTmp = post5 %}
        {% assign postTmpWeight = post5Weight %}
        
        {% assign post5 = post6 %}
        {% assign post5Weight = post6Weight %}
        
        {% assign post6 = postTmp %}
        {% assign post6Weight = postTmpWeight %}
    {% endif %}
    {% if post5Weight >= post4Weight %}
        {% assign postTmp = post4 %}
        {% assign postTmpWeight = post4Weight %}
        
        {% assign post4 = post5 %}
        {% assign post4Weight = post5Weight %}
        
        {% assign post5 = postTmp %}
        {% assign post5Weight = postTmpWeight %}
    {% endif %}
    {% if post4Weight >= post3Weight %}
        {% assign postTmp = post3 %}
        {% assign postTmpWeight = post3Weight %}
        
        {% assign post3 = post4 %}
        {% assign post3Weight = post4Weight %}
        
        {% assign post4 = postTmp %}
        {% assign post4Weight = postTmpWeight %}
    {% endif %}
    {% if post3Weight >= post2Weight %}
        {% assign postTmp = post2 %}
        {% assign postTmpWeight = post2Weight %}
        
        {% assign post2 = post3 %}
        {% assign post2Weight = post3Weight %}
        
        {% assign post3 = postTmp %}
        {% assign post3Weight = postTmpWeight %}
    {% endif %}
    {% if post2Weight >= post1Weight %}
        {% assign postTmp = post1 %}
        {% assign postTmpWeight = post1Weight %}
        
        {% assign post1 = post2 %}
        {% assign post1Weight = post2Weight %}
        
        {% assign post2 = postTmp %}
        {% assign post2Weight = postTmpWeight %}
    {% endif %}
    {% if post1Weight >= post0Weight %}
        {% assign postTmp = post0 %}
        {% assign postTmpWeight = post0Weight %}
        
        {% assign post0 = post1 %}
        {% assign post0Weight = post1Weight %}
        
        {% assign post1 = postTmp %}
        {% assign post1Weight = postTmpWeight %}
    {% endif %}
{% endfor %}

<li><a href="{{ site.url }}{{ post0.url }}">{{ post0.title }}({{ post0Weight }})</a></li>
<li><a href="{{ site.url }}{{ post1.url }}">{{ post1.title }}({{ post1Weight }})</a></li>
<li><a href="{{ site.url }}{{ post2.url }}">{{ post2.title }}({{ post2Weight }})</a></li>
<li><a href="{{ site.url }}{{ post3.url }}">{{ post3.title }}({{ post3Weight }})</a></li>
<li><a href="{{ site.url }}{{ post4.url }}">{{ post4.title }}({{ post4Weight }})</a></li>
<li><a href="{{ site.url }}{{ post5.url }}">{{ post5.title }}({{ post5Weight }})</a></li>
<li><a href="{{ site.url }}{{ post6.url }}">{{ post6.title }}({{ post6Weight }})</a></li>
<li><a href="{{ site.url }}{{ post7.url }}">{{ post7.title }}({{ post7Weight }})</a></li>
<li><a href="{{ site.url }}{{ post8.url }}">{{ post8.title }}({{ post8Weight }})</a></li>
<li><a href="{{ site.url }}{{ post9.url }}">{{ post9.title }}({{ post9Weight }})</a></li>
