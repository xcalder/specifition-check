<?php

namespace SpecifitionCheck;

use Encore\Admin\Admin;
use Encore\Admin\Form;
use Illuminate\Support\ServiceProvider;

class SpecifitionCheckServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function boot(SpecifitionCheckExtension $extension)
    {
        if (! SpecifitionCheckExtension::boot()) {
            return ;
        }

        if ($views = $extension->views()) {
            $this->loadViewsFrom($views, 'specifition-check');
        }

        if ($this->app->runningInConsole() && $assets = $extension->assets()) {
            $this->publishes(
                [$assets => public_path('vendor/xcalder/specifition-check')],
                'specifition-check'
            );
        }

        Admin::booting(function () {
            Form::extend('specifitionCheck', SpecifitionCheck::class);
        });
    }
}