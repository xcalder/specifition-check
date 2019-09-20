<?php

namespace SpecifitionCheck;

use Encore\Admin\Form\Field;

class SpecifitionCheck extends Field
{
    protected $view = 'specifition-check::index';

    protected static $css = [
        //'vendor/xcalder/specifition-check/css/liandong.css',
    ];

    protected static $js = [
        'vendor/xcalder/specifition-check/specifition-check.js',
    ];
    
    private $ajaxOptions;
    private $event;
    private $event_;
    
    /**
     * Set options.
     *
     * @param array|callable|string $options
     *
     * @return $this|mixed
     */
    public function options($options = [])
    {
        // remote options
        if (is_string($options)) {
            return $this->loadRemoteOptions(...func_get_args());
        }
        
        return $this;
    }
    
    /**
     * Load options from remote.
     *
     * @param string $url
     * @param array  $parameters
     * @param array  $options
     *
     * @return $this
     */
    protected function loadRemoteOptions($url, $parameters = [], $options = [], $event = [])
    {
        if(isset($parameters['event'])){
            $this->event = $this->event_ = $parameters['event'];unset($parameters['event']);
        }
        
        $this->ajaxOptions = [
            'url' => $url.'?'.http_build_query($parameters),
        ];
        
        $this->ajaxOptions = json_encode(array_merge($this->ajaxOptions, $options));
        
        return $this;
    }
    
    /**
     * {@inheritdoc}
     */
    public function render()
    {
        $class = $this->getElementClass()[0];
        
        $this->script = <<<EOT
function set$class (event = ''){
    if(event != ''){
        var ajaxOptions = {$this->ajaxOptions}
        var url = ajaxOptions.url;
        url = url + '&category_id='+event
        ajaxOptions.url = url
    }

    $.ajax(ajaxOptions).done(function(data) {
        $("{$this->getElementClassSelector()}").each(function(index, element) {
            $(element).SelectSku(data, element);
        });
        
    });
}

EOT;
        if(!empty($this->event)){
            $this->script .= <<<ETO
            
            $('select[name="{$this->event}"]').on('change', function(){
                set{$class}($(this).val());
            });
ETO;
        }
        return parent::render();
    }
}
