<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
/**
 * Class Feedback
 *
 * @property string $name
 * @property string $email
 * @property string $message
 */
class Feedback extends Model
{
    protected $table = 'feedbacks';
    protected $fillable = [
        'name',
        'email',
        'message',
    ];

    /**
     * Validation Rules for model
     *
     * @var array
     */
    public static $rules = [
        'name'    => 'required|max:100',
        'email'   => 'required|email|max:100',
        'message' => 'required|max:1000',
    ];
}