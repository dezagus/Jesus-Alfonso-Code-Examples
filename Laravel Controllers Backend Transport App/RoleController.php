<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $roles = Role::all();
        $permissions = Permission::all();
        return view('admin.roles.index', compact('user', 'permissions', 'roles'));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|unique:roles,name',
            'permission' => 'required',
        ]);

        $role = Role::create(['name' => $request->input('name')]);
        $role->syncPermissions($request->input('permission'));

        return redirect('/admin/roles')->with('message','Rol creado correctamente.');
    }

    public function edit(Role $role)
    {
        return redirect('/admin/roles')->with('message','Funcionalidad aun no disponible.');
    }

    public function destroy(Role $role)
    {
        if ($role->name == 'Administrador') {
            return redirect('/admin/users')->with('message','No puedes eliminar el rol Administrador.');
        }
        $role->delete();

        return redirect('/admin/roles')->with('message','Rol eliminado correctamente.');
    }
}
