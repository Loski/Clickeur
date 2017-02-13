<!doctype html>
<html>
<head>
    @include('includes.head')
</head>
<body>
    <div class="container-fluid">
        <header class="row">
            @include('includes.header')
        </header>
        <main>
            @yield('content')
        </main>
    @include('includes.footer')
    </div>
</body>
</html>