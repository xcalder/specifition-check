(function() {
	var Sku = function(ele, opt) {
        this.$element = ele,
        this.defaults = {
            selected: [],
            specifitions: []
        },
        this.options = $.extend({}, this.defaults, opt)
    }
    //定义Beautifier的方法
    Sku.prototype = {
        setCheckbox: function() {
        	var _this = this;
        	var html = '';
        	if(this.options.specifitions.length > 0){
        		for(var i in this.options.specifitions){
        			var group = this.options.specifitions[i];
        			html += '<ul class="list-unstyled">';
                	html += '<li class="father_title"><strong>'+group.title+'</strong></li>';
                	
                	if(group.childs.length > 0){
                		html += '<li class="father_item-'+i+'">';
                		for(var c in group.childs){
                			var child = group.childs[c];
                			html += '<label class="checkbox-inline">';
                			html += '<input type="checkbox" data-value="'+child.id+'" value="'+child.title+'" '+ (child.checked ? 'checked' : '')+'>'+child.title;
            				html += '</label>';
                		}
                		html += '</li>';
                	}
                	
                	html += '</ul>';
        		}
        	}
        	
        	_this.$element.html(html);
        	_this.$element.find('label').bind("change", function () {
                _this.setTable();
            });
        	return true;
        },
        setTable: function(){
        	this.hebingFunction();
            var SKUObj = $(".father_title");
            //var skuCount = SKUObj.length;//
            var arrayTile = new Array();//标题组数
            var arrayInfor = new Array();//盛放每组选中的CheckBox值的对象
            var arrayColumn = new Array();//指定列，用来合并哪些列
            var bCheck = true;//是否全选
            var columnIndex = 0;
            $.each(SKUObj, function (i, item){
                arrayColumn.push(columnIndex);
                columnIndex++;
                arrayTile.push(SKUObj.find("strong").eq(i).html().replace("：", ""));
                var itemName = "father_item-" + i;
                //选中的CHeckBox取值
                var order = new Array();
                $("." + itemName + " input[type=checkbox]:checked").each(function (){
                	//order.push($(this).val());
                	
                    order.push(JSON.stringify({
                    	id: $(this).attr('data-value'),
                    	title: $(this).val()
                    }));
                    
                });
                arrayInfor.push(order);
                if (order.join() == ""){
                    bCheck = false;
                }
            });
            //开始创建Table表
            if (bCheck == true) {
                var RowsCount = 0;
                $(".productsku-table").html("");
                var table = $("<table class=\"table table-bordered\" cellpadding=\"1\" cellspacing=\"0\"></table>");
                table.appendTo($(".productsku-table"));
                var thead = $("<thead></thead>");
                thead.appendTo(table);
                var trHead = $("<tr></tr>");
                trHead.appendTo(thead);
                //创建表头
                $.each(arrayTile, function (index, item) {
                    var td = $("<th>" + item + "</th>");
                    td.appendTo(trHead);
                });
                var itemColumHead = $("<th style=\"width:100px;\">图片</th><th style=\"width:100px;\">市场价</th><th style=\"width:100px;\">价格</th><th style=\"width:100px;\">库存</th> ");
                itemColumHead.appendTo(trHead);
                var itemColumHead2 = $("<td style=\"width:120px;\">条形码</td><td style=\"width:100px;\">主单位换算</td><td style=\"width:100px;\">状态</td>");
                itemColumHead2.appendTo(trHead);
                var tbody = $("<tbody></tbody>");
                tbody.appendTo(table);
                ////生成组合
                var zuheDate = this.doExchange(arrayInfor);

                if (zuheDate.length > 0) {
                    //创建行
                    $.each(zuheDate, function (index, item) {
                    	var specifition_id = '';
                        var td_array = item.split("||");
                        var tr = $("<tr></tr>");
                        tr.appendTo(tbody);
                        $.each(td_array, function (i, values) {
                        	var value = JSON.parse(values);
                        	specifition_id += value.id+',';
                            var td = $("<td>" + value.title + "</td>");
                            var tc = $('<input type="hidden" name="productsku['+index+'][specifition][]" value="'+value.title+'">');
                            tc.appendTo(tr);
                            td.appendTo(tr);
                        });
                        specifition_id = specifition_id.replace(/^(\s|,)+|(\s|,)+$/g, '');
                        
                        var td1 = $("<td ><input name=\"productsku["+index+"][img]\" data-id=\""+specifition_id+"-img\" class=\"l-text form-control\" type=\"text\" value=\"\"></td>");
                        td1.appendTo(tr);
                        var td2 = $("<td ><input name=\"productsku["+index+"][market_price]\" data-id=\""+specifition_id+"-market_price\" class=\"l-text form-control\" type=\"text\" value=\"\"></td>");
                        td2.appendTo(tr);
                        var td3 = $("<td ><input name=\"productsku["+index+"][price]\" data-id=\""+specifition_id+"-price\" class=\"l-text form-control\" type=\"text\" value=\"\"></td>");
                        td3.appendTo(tr);
                        var td4 = $("<td ><input name=\"productsku["+index+"][storage]\" data-id=\""+specifition_id+"-storage\" class=\"l-text form-control\" type=\"text\" value=\"\"></td>");
                        td4.appendTo(tr);
                        var td5 = $("<td ><input name=\"productsku["+index+"][code]\" data-id=\""+specifition_id+"-code\" class=\"l-text form-control\" type=\"text\" value=\"\"></td>");
                        td5.appendTo(tr);
                        var td6 = $("<td ><input name=\"productsku["+index+"][to_unit]\" data-id=\""+specifition_id+"-to_unit\" class=\"l-text form-control\" type=\"text\" value=\"\"></td>");
                        td6.appendTo(tr);
                        var td7 = $("<td ><select name=\"productsku["+index+"][status]\" data-id=\""+specifition_id+"-status\" class=\"l-text form-control\"><option value=\"0\" selected>下架</option><option value=\"1\">上架</option></select><input name=\"productsku["+index+"][specifition_id]\" data-id=\""+specifition_id+"-specifition_id\" type=\"hidden\" value=\""+specifition_id+"\"></td>");
                        td7.appendTo(tr);
                    });
                }
                
                //结束创建Table表
                arrayColumn.pop();//删除数组中最后一项
                //合并单元格
                $(table).mergeCell({
                    // 目前只有cols这么一个配置项, 用数组表示列的索引,从0开始
                    cols: arrayColumn
                });
            } else{
                //未全选中,清除表格
                $('.productsku-table').html('');
            }
            
            this.setSelected();
        },
        
        hebingFunction: function(){
        	$.fn.mergeCell = function (options) {
                return this.each(function () {
                    var cols = options.cols;
                    for (var i = cols.length - 1; cols[i] != undefined; i--) {
                        // fixbug console调试
                        // console.debug(cols[i]);
                        mergeCell($(this), cols[i]);
                    }
                    dispose($(this));
                });
            };
            function mergeCell($table, colIndex) {
                $table.data('col-content', ''); // 存放单元格内容
                $table.data('col-rowspan', 1); // 存放计算的rowspan值 默认为1
                $table.data('col-td', $()); // 存放发现的第一个与前一行比较结果不同td(jQuery封装过的), 默认一个"空"的jquery对象
                $table.data('trNum', $('tbody tr', $table).length); // 要处理表格的总行数, 用于最后一行做特殊处理时进行判断之用
                // 进行"扫面"处理 关键是定位col-td, 和其对应的rowspan
                $('tbody tr', $table).each(function (index) {
                    // td:eq中的colIndex即列索引
                    var $td = $('td:eq(' + colIndex + ')', this);
                    // 取出单元格的当前内容
                    var currentContent = $td.html();
                    // 第一次时走此分支
                    if ($table.data('col-content') == '') {
                        $table.data('col-content', currentContent);
                        $table.data('col-td', $td);
                    } else {
                        // 上一行与当前行内容相同
                        if ($table.data('col-content') == currentContent) {
                            // 上一行与当前行内容相同则col-rowspan累加, 保存新值
                            var rowspan = $table.data('col-rowspan') + 1;
                            $table.data('col-rowspan', rowspan);
                            // 值得注意的是 如果用了$td.remove()就会对其他列的处理造成影响
                            $td.hide();
                            // 最后一行的情况比较特殊一点
                            // 比如最后2行 td中的内容是一样的, 那么到最后一行就应该把此时的col-td里保存的td设置rowspan
                            if (++index == $table.data('trNum'))
                                $table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
                        } else { // 上一行与当前行内容不同
                            // col-rowspan默认为1, 如果统计出的col-rowspan没有变化, 不处理
                            if ($table.data('col-rowspan') != 1) {
                                $table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
                            }
                            // 保存第一次出现不同内容的td, 和其内容, 重置col-rowspan
                            $table.data('col-td', $td);
                            $table.data('col-content', $td.html());
                            $table.data('col-rowspan', 1);
                        }
                    }
                });
            }
            // 同样是个private函数 清理内存之用
            function dispose($table) {
                $table.removeData();
            }
        },
      //组合数组
        doExchange: function (doubleArrays) {
            var len = doubleArrays.length;
            if (len >= 2) {
                var arr1 = doubleArrays[0];
                var arr2 = doubleArrays[1];
                var len1 = doubleArrays[0].length;
                var len2 = doubleArrays[1].length;
                var newlen = len1 * len2;
                var temp = new Array(newlen);
                var index = 0;
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        temp[index] = arr1[i] + "||" + arr2[j];
                        index++;
                    }
                }
                var newArray = new Array(len - 1);
                newArray[0] = temp;
                if (len > 2) {
                    var _count = 1;
                    for (var i = 2; i < len; i++) {
                        newArray[_count] = doubleArrays[i];
                        _count++;
                    }
                }
                //console.log(newArray);
                return this.doExchange(newArray);
            }
            else {
                return doubleArrays[0];
            }
        },
        setSelected: function(){
        	if(this.options.selected.length == 0){
        		return false;
        	}
        	for(var i in this.options.selected){
        		var selected = this.options.selected[i];
        		var id = selected.specifition_id;
        		$('input[data-id="'+id+'-market_price"]').val(selected.market_price);
        		$('input[data-id="'+id+'-price"]').val(selected.price);
        		$('input[data-id="'+id+'-storage"]').val(selected.storage);
        		$('input[data-id="'+id+'-code"]').val(selected.code);
        		$('input[data-id="'+id+'-to_unit"]').val(selected.to_unit);
        		$('input[data-id="'+id+'-specifition_id"]').val(id);
        		$('input[data-id="'+id+'-img"]').val(selected.img);
        		$('select[data-id="'+id+'-status"]').val(selected.status);
        		console.log($('input[data-id="'+id+'-price"]'))
        	}
        	console.log(123)
        }
    }
	
	$.fn.SelectSku = function(options, element) {
        var sku = new Sku($(element), options);
        //调用其方法
        sku.setCheckbox();
        sku.setTable();
        //sku.setSelected();
        return true;
	}
})();