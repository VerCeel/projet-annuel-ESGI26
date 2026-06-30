<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'image' => 'nullable|string|max:2048',
            'stock' => 'integer|min:0',
            'status' => 'in:in stock,out of stock',
            'category_id' => 'exists:categories,id',
        ];
    }
}
