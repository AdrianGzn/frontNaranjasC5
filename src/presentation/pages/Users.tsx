import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ApiUserRepository } from '../../features/users/infrastructure/apiUser.repository';
import { User } from '../../features/users/domain/user.entity';
import Navbar from '../../shared/ui/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { GetAllUsersUseCase } from '../../features/users/application/GetAllUsersUseCase';
import { DeleteUserUseCase } from '../../features/users/application/DeleteUserUseCase';
import { UpdateUserUseCase } from '../../features/users/application/UpdateUserUseCase';
import { CreateUserUseCase } from '../../features/users/application/CreateUserUseCase';
import { GetByJefeUseCase } from '../../features/users/application/GetByJefeUseCase';
import { AuthService } from '../../shared/hooks/auth_user.service';

export const Users = () => {
    // Estado para usuarios y usuario actual
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Formulario de usuario
    const [formUser, setFormUser] = useState<User>({
        id: 0,
        name: '',
        username: '',
        email: '',
        password: '',
        rol: '',
        idJefe: 0
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const userRepository = new ApiUserRepository();
    const getUsersUseCase = new GetAllUsersUseCase(userRepository)
    const deleteUserUseCase = new DeleteUserUseCase(userRepository)
    const updateUserUseCase = new UpdateUserUseCase(userRepository)
    const createUserUseCase = new CreateUserUseCase(userRepository)
    const getByJefeUseCase = new GetByJefeUseCase(userRepository)

    // Opciones para el dropdown de roles
    const roles = [
        { label: 'Dueño', value: 'dueño' },
        { label: 'Encargado', value: 'encargado' },
        { label: 'Recolector', value: 'recolector' }
    ];

    // Validar email
    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    // Cargar datos iniciales
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return false;
            }
            return true;
        };

        const getUserData = () => {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                try {
                    const user = JSON.parse(userJson);
                    const completeUser: User = {
                        id: user.id || 0,
                        name: user.name || '',
                        username: user.username || '',
                        email: user.email || '',
                        rol: user.rol || '',
                        idJefe: user.idJefe || 0
                    };
                    setCurrentUser(completeUser);
                    setIsOwner(user.rol === 'dueño');
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        };

        const loadUsers = async () => {
            const user = AuthService.getUserData();
            if (!user) {
                navigate('/');
                return;
            }

            try {
                getByJefeUseCase.execute(user.id).then((users) => {
                    setUsers(users);
                });
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los usuarios'
                });
            } finally {
                setLoading(false);
            }
        };

        if (checkAuth()) {
            getUserData();
            loadUsers();
        }
    }, [navigate]);

    // Manejadores de eventos
    const handleAddNew = () => {
        setFormUser({
            id: 0,
            name: '',
            username: '',
            email: '',
            password: '',
            rol: '',
            idJefe: currentUser?.id || 0 // Set the current user's ID as the supervisor
        });
        setEditMode(false);
        setFormSubmitted(false);
        setShowDialog(true);
    };

    const handleEdit = (user: User) => {
        setFormUser({ ...user });
        setEditMode(true);
        setFormSubmitted(false);
        setShowDialog(true);
    };

    const handleDelete = (user: User) => {
        confirmDialog({
            message: `¿Está seguro que desea eliminar al usuario ${user.name}?`,
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteUserUseCase.execute(user.id);
                    setUsers(users.filter(u => u.id !== user.id));
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Usuario eliminado correctamente'
                    });
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al eliminar usuario'
                    });
                }
            }
        });
    };

    const handleFormChange = (e: any, field: keyof User) => {
        setFormUser({
            ...formUser,
            [field]: e.target.value
        });
    };

    const handleFormSubmit = async () => {
        setFormSubmitted(true);

        // Validación
        if (!formUser.name || !formUser.username || (!editMode && !formUser.password) || !formUser.rol) {
            return;
        }

        // Validar email
        if (formUser.email && !validateEmail(formUser.email)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'El formato del email no es válido'
            });
            return;
        }

        // Ensure idJefe is set to current user's ID for new users
        if (!editMode) {
            formUser.idJefe = currentUser?.id || 0;
        }

        try {
            // Create a new object with the correct property name for the backend
            const userToSend = {
                ...formUser,
                id_jefe: formUser.idJefe, // Add the snake_case version for the backend
            };

            // Log the user data being sent to the server
            console.log("Usuario a enviar:", userToSend);

            if (editMode) {
                await updateUserUseCase.execute(userToSend);
                setUsers(users.map(u => u.id === formUser.id ? formUser : u));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuario actualizado correctamente'
                });
            } else {
                const newUser = await createUserUseCase.execute(userToSend);
                setUsers([...users, newUser]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuario creado correctamente'
                });
            }
            setShowDialog(false);
        } catch (error) {
            console.error("Error completo:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: `Error al ${editMode ? 'actualizar' : 'crear'} usuario`
            });
        }
    };

    // Renderizadores para columnas de DataTable
    const actionBodyTemplate = (rowData: User) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEdit(rowData)}
                    disabled={!isOwner && currentUser?.id !== rowData.id}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => handleDelete(rowData)}
                    disabled={!isOwner || currentUser?.id === rowData.id}
                />
            </div>
        )
    };

    const rolBodyTemplate = (rowData: User) => {
        let badgeClass = '';

        switch (rowData.rol) {
            case 'dueño':
                badgeClass = 'bg-purple-100 text-purple-800 border border-purple-200';
                break;
            case 'encargado':
                badgeClass = 'bg-blue-100 text-blue-800 border border-blue-200';
                break;
            case 'recolector':
                badgeClass = 'bg-green-100 text-green-800 border border-green-200';
                break;
            default:
                badgeClass = 'bg-gray-100 text-gray-800 border border-gray-200';
        }

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
                {rowData.rol}
            </span>
        );
    };

    // Diálogo de formulario
    const dialogFooter = (
        <div>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                outlined
                onClick={() => setShowDialog(false)}
                className="mr-2"
            />
            <Button
                label={editMode ? 'Actualizar' : 'Guardar'}
                icon="pi pi-check"
                onClick={handleFormSubmit}
            />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-amber-50">
            <Navbar />
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-800">
                            Gestión de Usuarios
                        </h2>
                        {isOwner && (
                            <Button
                                label="Nuevo Usuario"
                                icon="pi pi-plus"
                                className="bg-amber-500 hover:bg-amber-600 border-amber-500"
                                onClick={handleAddNew}
                            />
                        )}
                    </div>

                    <DataTable
                        value={users}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        tableStyle={{ minWidth: '50rem' }}
                        loading={loading}
                        emptyMessage="No se encontraron usuarios"
                        className="p-datatable-sm"
                    >
                        <Column field="id" header="ID" style={{ width: '5%' }} />
                        <Column field="name" header="Nombre" style={{ width: '20%' }} />
                        <Column field="username" header="Usuario" style={{ width: '15%' }} />
                        <Column field="email" header="Email" style={{ width: '20%' }} />
                        <Column field="rol" header="Rol" style={{ width: '15%' }} body={rolBodyTemplate} />
                        <Column body={actionBodyTemplate} exportable={false} style={{ width: '10%', textAlign: 'center' }} />
                    </DataTable>
                </div>
            </div>

            <Dialog
                visible={showDialog}
                style={{ width: '450px', maxHeight: '90vh', overflow: 'auto' }}
                header={editMode ? "Editar Usuario" : "Nuevo Usuario"}
                modal
                className="p-fluid"
                footer={dialogFooter}
                onHide={() => setShowDialog(false)}
            >
                <div className="flex flex-col gap-4 mt-4">
                    <div className="field">
                        <label htmlFor="name" className="font-medium text-amber-700 mb-1 block">Nombre</label>
                        <InputText
                            id="name"
                            value={formUser.name}
                            onChange={(e) => handleFormChange(e, 'name')}
                            required
                            className={formSubmitted && !formUser.name ? 'p-invalid' : ''}
                        />
                        {formSubmitted && !formUser.name && (
                            <small className="p-error flex items-center gap-1 mt-1">
                                <i className="pi pi-exclamation-circle"></i>
                                El nombre es requerido
                            </small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="username" className="font-medium text-amber-700 mb-1 block">Nombre de Usuario</label>
                        <InputText
                            id="username"
                            value={formUser.username}
                            onChange={(e) => handleFormChange(e, 'username')}
                            required
                            className={formSubmitted && !formUser.username ? 'p-invalid' : ''}
                        />
                        {formSubmitted && !formUser.username && (
                            <small className="p-error flex items-center gap-1 mt-1">
                                <i className="pi pi-exclamation-circle"></i>
                                El nombre de usuario es requerido
                            </small>
                        )}
                    </div>

                    {/* Campo de email */}
                    <div className="field">
                        <label htmlFor="email" className="font-medium text-amber-700 mb-1 block">Email</label>
                        <InputText
                            id="email"
                            value={formUser.email}
                            onChange={(e) => handleFormChange(e, 'email')}
                            type="email"
                            className={formSubmitted && formUser.email && !validateEmail(formUser.email) ? 'p-invalid' : ''}
                            placeholder="ejemplo@correo.com"
                        />
                        {formSubmitted && formUser.email && !validateEmail(formUser.email) && (
                            <small className="p-error flex items-center gap-1 mt-1">
                                <i className="pi pi-exclamation-circle"></i>
                                El formato del email no es válido
                            </small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="password" className="font-medium text-amber-700 mb-1 block">
                            {editMode ? 'Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
                        </label>
                        <Password
                            id="password"
                            value={formUser.password}
                            onChange={(e) => handleFormChange(e, 'password')}
                            required={!editMode}
                            feedback={!editMode}
                            toggleMask
                            className={formSubmitted && !editMode && !formUser.password ? 'p-invalid' : ''}
                        />
                        {formSubmitted && !editMode && !formUser.password && (
                            <small className="p-error flex items-center gap-1 mt-1">
                                <i className="pi pi-exclamation-circle"></i>
                                La contraseña es requerida
                            </small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="rol" className="font-medium text-amber-700 mb-1 block">Rol</label>
                        <Dropdown
                            id="rol"
                            value={formUser.rol}
                            options={roles}
                            onChange={(e) => handleFormChange(e, 'rol')}
                            placeholder="Seleccione un rol"
                            required
                            disabled={!isOwner} // Solo el dueño puede cambiar roles
                            className={formSubmitted && !formUser.rol ? 'p-invalid' : ''}
                        />
                        {formSubmitted && !formUser.rol && (
                            <small className="p-error flex items-center gap-1 mt-1">
                                <i className="pi pi-exclamation-circle"></i>
                                El rol es requerido
                            </small>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Users;