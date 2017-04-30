---
layout: page
title: Pointless whimsy
permalink: /about/
---

500 word stories about anything and nothing. New ones every Wednesday


{% for member in site.data.writers %}
  <div>
  <h1>{{ member.name }} </h1>
  
  {% if member.twitter %}      
  <div>{% include icon-twitter.html username=member.twitter %}</div>
  {% endif %}
  
  
  {% if member.web %}      
  <div><a href="http://{{ member.web}}" target="_blank">{{ member.web }}</a></div>
  {% endif %}
  <br/>
  </div>
{% endfor %}

