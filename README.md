这个扩展因为依赖商品管理接口，目前商品部分还没开源，此库仅做参考之用，，功能已经整合到商品上，不再更新了

laravel-admin extension 仿淘宝商品SKU排列组合
======

![预览](https://github.com/xcalder/specifition-check/blob/master/demo.png?raw=true)

## 重要说明
目前版本还不完善，仅做参考之用,

## 安装
```bash
composer require xcalder/specifition-check
php artisan vendor:publish --provider="xcalder/specifition-check/SpecifitionCheckServiceProvider"
```

### 数据库配置
- specifition_group 表 //商品规格组表

- specifition表 //规格选项表

- product_sku  //商品sku表


### 使用方法
```php
$form->specifitionCheck('productsku', '规格SKU')->options(url('admin/b2b2c/specifition/select'), ['id' => $this->id, 'event' => 'category_id']);

//specifition_group表关联到product_category商品分类,
//监听分类(event)改变动态获取分类对应的规格选项
```

### 其他说明
sku 分表存放，需要在回调中处理sku数据

原始数据
```json
{
	"selected": [{
		"id": 1,
		"product_id": 49,
		"specifition_id": "49,101,105",
		"img": "4444",
		"status": 1,
		"price": 200,
		"market_price": 300,
		"specifition": "111111111111111111111111",
		"storage": 300,
		"sales_volume": 10,
		"to_unit": "1",
		"note": "111111111",
		"created_at": null,
		"updated_at": null
	}],
	"specifitions": [{
		"id": 13,
		"title": "group-title-13",
		"childs": [{
			"id": 49,
			"title": "spec-title1",
			"value": "value131",
			"checked": true
		}, {
			"id": 50,
			"title": "spec-title2",
			"value": "value132",
			"checked": false
		}, {
			"id": 51,
			"title": "spec-title3",
			"value": "value133",
			"checked": false
		}, {
			"id": 52,
			"title": "spec-title4",
			"value": "value134",
			"checked": false
		}]
	}, {
		"id": 26,
		"title": "group-title-26",
		"childs": [{
			"id": 101,
			"title": "spec-title1",
			"value": "value261",
			"checked": true
		}, {
			"id": 102,
			"title": "spec-title2",
			"value": "value262",
			"checked": false
		}, {
			"id": 103,
			"title": "spec-title3",
			"value": "value263",
			"checked": false
		}, {
			"id": 104,
			"title": "spec-title4",
			"value": "value264",
			"checked": false
		}]
	}, {
		"id": 27,
		"title": "group-title-27",
		"childs": [{
			"id": 105,
			"title": "spec-title1",
			"value": "value271",
			"checked": true
		}, {
			"id": 106,
			"title": "spec-title2",
			"value": "value272",
			"checked": false
		}, {
			"id": 107,
			"title": "spec-title3",
			"value": "value273",
			"checked": false
		}, {
			"id": 108,
			"title": "spec-title4",
			"value": "value274",
			"checked": false
		}]
	}]
}
```

```php
// 处理数据
$form->saving(function($form) {
    dd($form->specifitionCheck);
});
```
