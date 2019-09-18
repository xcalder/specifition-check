<div class="{{$viewClass['form-group']}} {!! !$errors->has($errorKey) ? '' : 'has-error' !!}">

<label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>

    <div class="{{$viewClass['field']}}">

        @include('admin::form.error')

        <input type="hidden" name="{{$name}}"/>
        
        <div style="border: 1px solid #ccc;padding: 10px;">
        	<div class="{{$class}}"></div>
        	<div class="{{ $class }}-table" style="margin-top: 15px;"></div>
        </div>
        
        @include('admin::form.help-block')

    </div>
</div>
