---
layout: page
title: About
permalink: /about/
---

_**What's all this then?**_

It's all about Pointless Whimsy

Once a week we pick a random theme, three things the story has to contain, and limit ourselves to 500 words.

_**What's with the name?**_

Pointless whimsy, innit. Or an excuse for appealing puns, for shredding conventions, for laying on the sweetness thick and fruity, for as long as you can Paddington Bear it.

_**500 words to read while you're:**_

 - boiling the kettle 
 - having a poo 
 - twiddling your moustache 
 - walking to work 
 - between pool shots 
 - defying the patriachy

_**Who we are**_


{% for member in site.data.writers %}
  <div>
  <strong>{{ member.name }} </strong>
  
  {% if member.twitter %}      
  <div>{% include icon-twitter.html username=member.twitter %}</div>
  {% endif %}
  
  
  {% if member.web %}      
  <div><a href="http://{{ member.web}}" target="_blank">{{ member.web }}</a></div>
  {% endif %}

  {% if member.about %}      
  <div>{{ member.about }}</div>
  {% endif %}
  
  
  <br/>
  </div>
{% endfor %}

