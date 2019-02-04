<?php
if(!empty($_REQUEST)) {
    var_dump($_REQUEST);
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">

    <title>Index</title>

    <!-- JS Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="js/index.js"></script>

    <!-- CSS Styles -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="css/index.css">
</head>
<body>
<div class="container">
    <div class="row">
        <form class="col s12" method="post">
            <div class="row">
                <div class="input-field col s6">
                    <input placeholder="Placeholder" name="first_name" id="first_name" type="text" class="validate">
                    <label for="first_name">First Name</label>
                </div>
                <div class="input-field col s6">
                    <input name="last_name" id="last_name" type="text" class="validate">
                    <label for="last_name">Last Name</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input name="password" id="password" type="password" class="validate" minlength="6">
                    <label for="password">Password</label>
                    <span class="helper-text">Mindestens 6 Zeichen</span>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s6">
                    <input name="email" id="email" type="email" class="validate">
                    <label for="email">Email</label>
                </div>
                <div class="input-field col s6">
                    <i class="material-icons prefix">account_circle</i>
                    <input name="first_name_icon" id="icon_prefix" type="text" class="validate">
                    <label for="icon_prefix">First Name</label>
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <p>
                        <label>
                            <input type="checkbox" name="checkbox"/>
                            <span>Checkbox</span>
                        </label>
                    </p>
                </div>
                <div class="col s6">
                    <input type="text" name="date" class="datepicker">
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <p>
                        <label>
                            <input name="radio" type="radio" value="red" checked/>
                            <span>Red</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="radio" value="yellow" type="radio"/>
                            <span>Yellow</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="radio" value="green" type="radio"/>
                            <span>Green</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="radio" type="radio" value="brown" disabled="disabled"/>
                            <span>Brown</span>
                        </label>
                    </p>
                </div>
                <div class="input-field col s6">
                    <select name="select">
                        <option value="" disabled selected>Choose your option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <label>Materialize Select</label>
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <input type="text" class="timepicker">
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <button class="btn" type="submit">Absenden</button>
                </div>
            </div>
        </form>
    </div>
</div>
</body>
</html>