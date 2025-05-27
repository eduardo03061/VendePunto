<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\ContactoMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function index(){
        return "index";
    }
    public function email($correo,Request $request){

        Mail::to($correo,'Contact')
        ->send(new ContactoMail($request->mensaje,$request->subject));
        $mensaje="Correo enviado";
        return view('mail.form',compact('correo','mensaje'));
    }
    public function formulario($correo, Request $request){
        $mensaje="";
        return view('mail.form',compact('correo','mensaje'));
    }

    public function contact(Request $request){

        #mail
        $contact = [
            'name'=>$request->get('name'),
            'email'=>$request->get('email'),
            'phone'=>$request->get('phone'),
            'subject2'=>$request->get('subject'),
            'message'=>$request->get('message')
        ];
        try{
        #mail
        $activacion = ['Nombre'=>$request->get('name'),
                      'Correo'=>$request->get('email'),
                      'Numero'=>$request->get('phone'),
                      'Sujeto'=>$request->get('subject'),
                      'Mensaje'=>$request->get('message')
                    ];
        Mail::send('mail.contact',$activacion,function($msj) use($request){
            $msj->subject('Correo de contacto | Test');
            $msj->to($request->get('email'));
            $msj->bcc('eduardo@vendepunto.com');
            });
        
            return view('partials.thankscontactus');
            // dd("guardado");
        }catch(\Exception $e){
            return view('partials.thankscontactus');
        }
    }
}
