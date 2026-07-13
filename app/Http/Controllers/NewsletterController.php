<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\PostNewsletterRequest;
use Inertia\Inertia;

use App\Models\Newsletter;

use Illuminate\Support\Facades\Http;

class NewsletterController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function enviar(PostNewsletterRequest $request) {
        if($request->post()){
            $newsletter = new Newsletter;

            $newsletter->email = $request->email;

            $response = $newsletter->save();

            $response = Http::post('https://api.rd.services/platform/conversions?api_key=' . env('RDSTATION_TOKEN'), [
                    'event_type' => 'CONVERSION',
                    'event_family' => 'CDP',
                    'payload' => [
                        'conversion_identifier' => $request->form ?? 'form_newsletter',
                        'name' => $request->nome ?? '',
                        'email' => $request->email,
                        'available_for_mailing' => true,

                        'legal_bases' => [
                            [
                                'category' => 'communications',
                                'type' => 'consent',
                                'status' => 'granted',
                            ],
                        ],
                    ]
                ]);

            if ($response) {
                $data = [
                    'email' => $request->email
                ];

                // Mail::send('emails.newsletter', $data, function($message)use($data) {
                //     $message->from('envios@pizzato.net', 'Pizzato')
                //             ->to('atendimento@pizzato.net')
                //             ->bcc('rafael@8poroito.com.br')
                //             ->subject('Uma nova assinatura de newsletter foi recebida através do site');
                // });

                return back()->with('message', [
                    'type' => 'newsSuccess',
                    'msg' => 'Contato enviado com sucesso!',
                ]);
            }
        }

        return Inertia::location(route('Home.index'));
    }
};