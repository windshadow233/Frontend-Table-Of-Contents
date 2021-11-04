function scroll(id){
  var top = $('#' + id).offset().top;
  $('html,body').animate({scrollTop: Math.floor(top) - 30},500);
}
class Title{
  constructor(dom){
    this.dom = dom;
    this.tag = dom.tagName;
    let priors = {
      'H1': 6,
      'H2': 5,
      'H3': 4,
      'H4': 3,
      'H5': 2,
      'H6': 1
    }
    this.prior = priors[this.tag];
    this.children = [];
    this.link_to = dom.id;
    this.number = 1;
  }
  insert(child){
    let number = this.children.length;
    if (number == 0){
      child.number = this.number + '.1'
      this.children.push(child);
    }
    else{
      let last_child = this.children[this.children.length - 1];
      if (last_child.prior <= child.prior){
        child.number = this.number + '.' + (number + 1);
        this.children.push(child);
      }
      else{
        last_child.insert(child);
      }
    }
  }
  create_dom(if_number){
    let children_dom;
    let self_dom = $('<li>', {
      'class': 'toc-li-' + this.tag
    });
    let number = if_number? this.number + '. ': '';
    let link = $('<a>', {
      'class': 'toc-a-' + this.tag,
      'href': 'javascript:void(0);',
      'link-to': this.link_to
    });
    link.html(number + this.dom.innerHTML.replace(/<a.*?>/,'').replace(/<\/?a>/,''));
    self_dom.append(link);
    if (this.children.length == 0){
      return self_dom;
    }
    else{
      children_dom = $('<ul>', {
        'class': 'toc-ul-' + this.tag
      });
      for (let child of this.children){
        children_dom.append(child.create_dom(if_number));
      }
    }
    self_dom.append(children_dom);
    return self_dom;
  }
}
class TableOfContents{
  constructor(config){
    this.config = config;
    this.config['titles'] = this.config['titles'] || 'h1,h2,h3';
    this.config['toc-title'] = this.config['toc-title'] || '目录';
    this.config['id-prefix'] = this.config['id-prefix'] || 'toc';
    this.config['left'] = this.config['left'] || 30;
    this.config['bottom'] = this.config['bottom'] || 60;
    this.config['number'] = (this.config['number'] == undefined)? true: this.config['number'];
    this.config['show-percentage'] = (this.config['show-percentage'] == undefined)? true: this.config['show-percentage'];
    let button = $('<div>', {
      'class': 'toc-btn'
    });
    let button_icon = $('<i>', {
      'class': 'fas fa-bars',
      'width': '30px',
      'height': '30px'
    })
    button.append(button_icon);
    button.addClass('animated bounceInDown');
    button.css({
      'left': this.config['left'] + 'px',
      'bottom': this.config['bottom'] + 'px',
    })
    $('body').append(button);
    let that = this;
    $(document).on('click', '.toc-ul a', function (){
      let ele = $(this);
      let link_to = ele.attr('link-to');
      scroll(link_to);
      ele.addClass('selected');
      let others = $('.toc-ul a').not(ele);
      others.removeClass('selected');
      that.switch_visible_state();
    });
    $(document).on('click', '.toc-btn', function(){
      that.switch_visible_state();
    });
    $(document).on('scroll', function(){
      let body = $('.toc-body');
      if (body.length > 0 && body.is(":visible")){
        that.update_percent();
        that.update_selected();
      }
    });
  }
  parse_titles(){
    let current_prior = 0;
    let parsed = [];
    let id = 0;
    let number = 0;
    let contents = $(this.config['selector']);
    let titles = contents.find(this.config.titles);
    for (let title of titles){
      title.id = this.config['id-prefix'] + '-id-' + (id++);
      let current_title = new Title(title);
      if (parsed.length == 0){
        parsed.push(current_title);
        number++;
      }
      else{
        let last_title = parsed[parsed.length - 1];
        if (last_title.prior <= current_title.prior){
          current_title.number = ++number;
          parsed.push(current_title);
        }
        else{
          last_title.insert(current_title);
        }
      }
    }

    return parsed;
  }
  switch_visible_state(){
    let body = $('.toc-body');
    if (body.is(":visible")){
      body.removeClass('fadeInBottomLeft');
      body.addClass('fadeOutBottomLeft');
      setTimeout(function(){
        body.hide();
      }, 250);
    }
    else{
      body.removeClass('fadeOutBottomLeft');
      body.addClass('fadeInBottomLeft');
      body.show();
      this.update_percent();
      this.update_selected();
    }
  }
  update_percent(){
    if (!this.config['show-percentage']) return;
    let contents = $(this.config['selector']);
    let last_content = $(contents[contents.length - 1]);
    let contents_total_height = last_content.offset().top + last_content.height();
    let window_height = $(window).height();
    let percentage = Math.min(Math.max(Math.floor($(window).scrollTop() / (contents_total_height - window_height) * 100), 0), 100);
    $('.toc-percent').html(percentage + '%');
  }
  update_selected(){
    let contents = $(this.config['selector']);
    let titles = contents.find(this.config.titles);
    let current_id = 0;
    let window_pos = $(window).scrollTop();
    if (window_pos < $(titles[1]).offset().top - 40){
      current_id = $(titles[0]).attr('id');
    }
    else{
      for (let id = 1; id < titles.length; id++){
        let title = $(titles[id]);
        if (window_pos > title.offset().top - 40){
          current_id = $(titles[id]).attr('id');
        }
      }
    }
    let ul = $('.toc-ul');
    let selected = ul.find('a[link-to="' + current_id + '"]');
    if (selected.length == 0){
      return;
    }
    selected.addClass('selected');
    let others = $('.toc-ul a').not(selected);
    others.removeClass('selected');
    let selected_offset = selected[0].offsetTop;
    let ul_scroll = ul.scrollTop();
    let range_top = ul_scroll + 50;
    let range_bottom = ul_scroll + ul.height() + (35 - selected.height());
    if (selected_offset < range_top){
      ul.scrollTop(selected_offset - 50);
    }
    if (selected_offset > range_bottom){
      ul.scrollTop(selected_offset - ul.height() - (35 - selected.height()));
    }
  }
  create_toc_html(parsed){
    let parent_dom = $('<div>', {'class': 'toc-body animated'});
    let headline = $('<div>', {'class': 'toc-headline'});
    let ul_dom = $('<ul>', {'class': 'toc-ul'});
    let headline_html = '<i class="fas fa-stream"></i> ' + this.config['toc-title'];
    if (this.config['show-percentage'])
      headline_html += '<div class="toc-percent">0%</div>'
    headline.html(headline_html);
    parent_dom.css({
      'left': this.config['left'] + 50 + 'px',
      'bottom': this.config['bottom'] + 50 + 'px'
    });
    parent_dom.append(headline);
    for (let title of parsed){
      ul_dom.append(title.create_dom(this.config['number']));
    }
    parent_dom.append(ul_dom);
    return parent_dom;
  }
  init(){
    let body = $('.toc-body');
    let is_visible = false;
    if (body.length >= 1){
      if (body.is(':visible')){
        is_visible = true;
      }
      body.addClass('fadeOutBottomLeft');
      setTimeout(function(){
        body.remove();
      }, 250);
    }
    let parsed = this.parse_titles();
    let html = this.create_toc_html(parsed);
    this.html = html;
    $('body').append(html);
    if (is_visible){
      $('.toc-body').addClass('fadeInBottomLeft');
      $('.toc-body').show();
    }
  }
}