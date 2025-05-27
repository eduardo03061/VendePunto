<?php

namespace App\Exports;

use App\Models\CompanyUser;
use App\Models\Inventory;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;

class InventoryExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $user_id = Auth::user()->id;
        //dd($user_id);
        $companyUser = CompanyUser::where('user_id', $user_id)->first();

        $query = Inventory::where('company_id', $companyUser->company_id)->get();

        return $query;
    }
}
