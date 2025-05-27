<?php

namespace App\Http\Controllers;

use App\Models\Code;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactoMail;
use App\Models\CompanyUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class CodeController extends Controller
{
    public function generate(Request $request)
    {
        $days = $request->input('days', 30);
        $subscription_id = $request->input('subscription_id', 1);

        $timestamp = dechex(time()); // Convierte el timestamp a hexadecimal (Ej: "65c18f3a")
        $timestamp = substr($timestamp, -4); // Toma los últimos 4 caracteres del timestamp
        $caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $codigo = '';

        for ($i = 0; $i < 4; $i++) { // Genera 4 caracteres aleatorios
            $codigo .= $caracteres[random_int(0, strlen($caracteres) - 1)];
        }



        $code = new Code();
        $code->code = strtoupper($timestamp . $codigo);
        $code->subcription_days = $days;
        $code->subscription_id = $subscription_id;
        $code->save();


        $message = [
            'message' => 'Code generated successfully!',
            'code' => $code->code,
            'subcription_days' => $code->subcription_days,
        ];

        return response()->json($message);
    }


    public function redeem(Request $request)
    {
        //dd($request->all());
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = Code::where('code', $request->code)->where('user_id', null)->first();

        if (!$code) {
            return back()->withErrors(['code' => 'Invalid code.']);
        }

        if ($code->user_id) {
            return back()->withErrors(['code' => 'Code has already been redeemed.']);
        }

        // Marcar el código como canjeado
        $code->user_id = Auth::id();
        $company_id = CompanyUser::where('user_id', '=', Auth::id())->first();
        $code->company_id = $company_id->id;
        $code->redeemed_at = now();
        $code->save();


        // Actualizar la suscripción del usuario
        $user = User::where('id', Auth::user()->id)->first();
        $user->subscription_ends_at = now()->addDays($code->subcription_days);
        $user->save();

        $template = 'mail.codeRedeemed'; // Cambia esto a la plantilla que desees usar
        $data = [
            'name' => $user->name,
            'code' => $code->code,
            'date' => now()->format('d/m/Y'),
            'subcription_days' => now()->addDays($code->subcription_days)->format('d/m/Y'),
        ];
        Mail::to($user->email)->send(new ContactoMail($request->name, 'Registro exitoso', $template, $data));

        return redirect()->route('dashboard')->with('status', 'Codigo canjeado correctamente.');
    }
}
