@extends('layouts.master')

@section('title', 'Page Title')
@section('content')
<div class="container top_elem display-ues">
	@foreach ($ues as $ue)
		<span class="flat"><a href=>{{ $ue->code_ue . " - " . $ue->name}}</a></span>
	@endforeach
</div>
@endsection