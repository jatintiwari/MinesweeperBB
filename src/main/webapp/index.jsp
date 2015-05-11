
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Minesweeper</title>

    <!-- Bootstrap core CSS -->
    <link href="resources/dist/css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
	
	.btn-group btn-lg{
		padding:4px;
	}
	
	</style>
  </head>
  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top" style="z-index:2000">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#" style="font-size: 20px">Minesweeper</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#newgame" >New Game</a></li>
            <li><a href="#about">Feedback</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div class="container" style="padding-top:50px">
      <div class="starter-template" id="idPlayArea"></div>

    </div><!-- /.container -->
    
    <script type="text/template" id="idNewGridForm">
	<div class="container" style="width:745px">
	<h3 style="text-align:center">Grid size for the game will be n*n cells.</h3>
	<nav class="navbar navbar-default">
  		<div class="container-fluid">
    	<div class="navbar-header">
			<form class="navbar-form navbar-left" role="gridSize" id="idGridForm" style="font-size:20px">
    			<div class="form-group form-group-lg">
       			 	<strong>Grid size: </strong>
        			<input type="number" class="form-control cellInput" 
										placeholder="Rows" id="idGridRows" min="1" max="10" style="width:120px">
					<span>X</span>
					<input class="form-control" placeholder="Columns" id="idGridColumns" style="width:120px" disabled>
    			</div>
  	  				<button type="submit" class="btn btn-default btn-lg">Create</button>
			</form>
		</div>
  		</div>
	</nav>
	</div>
	</script>
	<script type="text/template" id="idGridViewTemplate">
	<div style="height: 100%; text-align: center; padding: 30px 20px;" class="jumbotron">
	<div class="row">
        <div class="col-lg-2" style="padding-left: 0px; padding-right: 0px;">
          <div>
			<p>Click on the cells to either Open or flag them.</p>
				<div id="moveMessageDisplay"></div>
		</div>
        </div>

        <div class="col-lg-10" style="padding-left: 0px; padding-right: 0px;">
      <div id="gridView"></div>
        </div>
      </div>
	</div>
	</script>
	
	<script type="text/x-template" id="idCellTemplate">
		<div class="btn-group" role="group">
				<\%if(flag){%>
					<button type="button" class="btn btn-warning dropdown-toggle">
					<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
				<\%}else if(open && mine){%>
					<button type="button" class="btn btn-danger dropdown-toggle">
					<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
					
				<\%}else if(open && !flag){%>
					<button type="button" class="btn btn-success dropdown-toggle">
					<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
				<\%}else{%>
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false" >
						<span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span>						
					<\%}%>		
    	</button>
  	 		 <ul class="dropdown-menu" role="menu">
    			  <li><a id="open">Open</a></li>
    			  <li><a id="flag">Flag</a></li>
   			 </ul>
 		 </div>
	</script>
	
	<script type="text/template" id="idModalTemplate">
		<div class="modal fade " tabindex="-50" style="z-index:1050;" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" id="myModal">
  			<div class="modal-dialog" style="top:100px">
							<div id="gameMessageDisplay"></div>
			    </div>
  			</div>
		</div>
	</script>


    <!-- Placed at the end of the document so the pages load faster -->
    <script src="resources/lib/jquery.js"></script>
    <script src="resources/lib/underscore.js"></script>
    <script src="resources/lib/backbone.js"></script>
    <script src="resources/lib/backbone-validation-min.js"></script>
    <script src="resources/lib/util.js"></script>
    <script src="resources/dist/js/bootstrap.min.js"></script>
    <script src="resources/js/index.js"></script>
  </body>
</html>
