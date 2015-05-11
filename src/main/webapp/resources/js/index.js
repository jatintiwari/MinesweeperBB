/**
 * 
 */

var app = app || {};

app.Cell=Backbone.Model.extend({
	urlRoot:'cells',

	defaults:{
		id:'',
		open:false,
		flag:false,
		mine:false
	}
});


app.Grid=Backbone.Collection.extend({
	modal:app.Cell
});



app.CellView=Backbone.View.extend({
	className:'btn-group btn-lg',
	template:_.template($('#idCellTemplate').html()),
	events:{
		'click #open':'open',
		'click #flag':'flag'
	},
	open:function(){
		console.log('Open cell with id: '+this.model.id);
		if(!this.model.get('open')){
			$('#moveMessageDisplay').
			html('<span class="alert alert-warning" role="alert">Cell opened</span>').fadeIn("slow");
			app.gameRouter.navigate('cell/'+this.model.id+'/open',true);	
		}

	},

	flag:function(){
		console.log('Flag cell with id: '+this.model.id);
		if(!this.model.get('flag')){
			$('#moveMessageDisplay').
			html('<span class="alert alert-warning" role="alert">Cell flaged</span>').fadeIn("slow");
			app.gameRouter.navigate('cell/'+this.model.id+'/flag',true);
		}
	},

	initialize:function(){
		this.listenTo(this.model,'change',this.render);
	},
	render:function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});

app.GridView=Backbone.View.extend({
	el:'#gridView',
	template:_.template($('#idGridViewTemplate').html()),
	events:{

	},
	initialize:function(){
		this.listenTo(this.collection,'add',this.addOne);
		this.rowSize= Math.sqrt(this.collection.length);
		this.colSize=0;
		this.render();
	},
	render:function(){
		this.collection.each(this.addOne,this);
	},

	addOne:function(cell){
		if(this.colSize==this.rowSize){
			this.colSize=0;
			this.$el.append('<br>');
		}
		var cellView= new app.CellView({model:cell});
		this.$el.append(cellView.render().el);
		this.colSize++;
	}


});

app.NewGridForm=Backbone.View.extend({
	el:'#idGridForm',

	events:{
		'change #idGridRows':'idGridColumns',
		'keyup #idGridRows':'idGridColumns',
		'submit':'submit'
	},

	idGridColumns:function(){
		var noOfRows=$('#idGridRows').val();
		$('#idGridColumns').val(noOfRows);
	},

	submit:function(e){
		e.preventDefault();
		var noOfRows=$('#idGridRows').val();
		app.NewGame=Backbone.Model.extend({
			url:'cells/create?rowSize='+noOfRows
		});
		app.newGame=new app.NewGame();
		app.newGame.save(null,{
			success:function(model,response,options){
				if(response.success==='true'){
					app.gameRouter.navigate('creategrid/'+response.gridSize,true);	
				}else if(response.error){
					console.log(response.message);
				}
			}
		});
	},

	initialize:function(){
	},

});



app.GameRouter= Backbone.Router.extend({
	routes:{
		'':'index',
		'newgame':'newGame',
		'creategrid/:gridSize':'createGrid',
		'cell/:id/:action':'cellActions'
	},

	initialize:function(){

	},

	cellActions:function(id,action){
		var cell=app.grid.get(id);
		if(action==='flag'){
			cell.set({open:true});
			cell.set({flag:true});	
		}else if(action==='open'){
			cell.set({open:true});	
		}

		cell.save(null,{
			success:function(model,response,options){
				app.grid.add(model);
				if(response.mine){
					$('#idPlayArea').append(_.template($('#idModalTemplate').html()));
					$('#gameMessageDisplay').
					html('<div style="color:red;font-size:20px">'+response.message+'</div>')
					$('#myModal').modal({
						  keyboard: false,
						  backdrop:'static'
						});
				}else if(response.error){
					$('#gameMessageDisplay').
					html('<div class="alert alert-danger" role="alert">'+response.error+'</div>');
					$('#myModal').modal({
						  keyboard: false,
						  backdrop:'static'
						});
				}else if(response.win){
					$('#idPlayArea').append(_.template($('#idModalTemplate').html()));
					$('#myModal').modal({
						  keyboard: false,
						  backdrop:'static'
						});
					$('#gameMessageDisplay').
					html('<div class="alert alert-success" role="alert">'+response.message+'</div>');
				}else if(response.finish){
					$('#idPlayArea').append(_.template($('#idModalTemplate').html()));
					$('#myModal').modal({
						  keyboard: false,
						  backdrop:'static'
						});
					$('#gameMessageDisplay').
					html('<div style="color:red;font-size:20px">'+response.message+'</div>')
				}
			}
		});
	},

	createGrid:function(gridSize){
		$('#gridView').html('');
		$('#idPlayArea').html('');
		app.grid= new app.Grid();
		console.log("Grid Size: "+gridSize);
		$('#idPlayArea').html(_.template($('#idGridViewTemplate').html()));
		for(var cellId=0;cellId<gridSize;cellId++){
			var cell = new app.Cell({
				id:cellId
			});
			app.grid.add([cell]);
		}
		var gridView= new app.GridView({collection:app.grid});
	},

	index:function(){
		$('#idPlayArea').html("<h1>Window's famous game Minesweeper</h1>"
				+"<p class=\"lead\">Now available online.</p>"
				+"<p class=\"lead\">Click on New Game to start the game.</p>'");

	},

	newGame:function(){
		console.log('newGame');
		$('#idPlayArea').html(_.template($('#idNewGridForm').html()));
		var newGridForm = new app.NewGridForm();
	}
});

(function(){
	app.gameRouter= new app.GameRouter();
	Backbone.history.start();
})();


