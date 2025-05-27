<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $message;
    public $template;
    public $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($subject, $message, $template = 'mail.welcome', $data = [])
    {
        $this->subject = $subject;
        $this->message = $message;
        $this->template = $template;
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view($this->template)
                    ->subject($this->subject)
                    ->with([
                        'data' => $this->data,
                    ]);
    }
}