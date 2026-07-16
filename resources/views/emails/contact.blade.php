@extends('emails.layout')

@section('content')
<table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="580" style="width:580px;max-width:580px;">
    <tr>
        <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
    </tr>
    <tr>
        <td align="center">
            <!-- Logo & Webview -->
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                <tr>
                    <td align="center" class="container-padding">
                        <a href="{{ url('/') }}"><img style="width:72px;border:0px;display: inline!important;" src="{{ asset('site/img/logo.png') }}" width="120" border="0" alt="Pizzato"></a>
                    </td>
                </tr>
            </table>
            <!-- Logo & Webview -->
        </td>
    </tr>
    <tr>
        <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
    </tr>
    <tr>
        <td class="center-text" align="center" style="font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:42px;line-height:52px;font-weight:700;font-style:normal;color:#fff;text-decoration:none;letter-spacing:0px;">

            <div>
                Um novo contato foi enviado através do site
            </div>

        </td>
    </tr>
    <tr>
        <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
    </tr>
    <tr>
        <td class="center-text" align="left" style="font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">

            <div style="color: #fff">
                Nome: {{ $nome }}
            </div>
            <div style="color: #fff">
                E-mail: {{ $email }}
            </div>
            <div style="color: #fff">
                Telefone: {{ $telefone }}
            </div>
            <div style="color: #fff">
                Assunto: {{ $assunto }}
            </div>
            <div style="color: #fff">
                Mensagem: {{ $mensagem }}
            </div>
        </td>
        
    </tr>
    <tr>
        <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
    </tr>
    <tr>
        <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
    </tr>
</table>
@endsection