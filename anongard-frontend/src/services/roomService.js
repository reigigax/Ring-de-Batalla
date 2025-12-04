const API_URL = 'http://localhost:3000/api';

export const roomService = {
    async getAll() {
        const response = await fetch(`${API_URL}/salas`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener salas');
        return response.json();
    },

    async create(roomData) {
        const response = await fetch(`${API_URL}/salas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(roomData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear sala');
        }
        return response.json();
    },

    async update(id, roomData) {
        const response = await fetch(`${API_URL}/salas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(roomData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al actualizar sala');
        }
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/salas/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al eliminar sala');
        }
        return response.json();
    },

    async join(id) {
        const response = await fetch(`${API_URL}/salas/${id}/join`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al unirse a la sala');
        }
        return response.json();
    },

    async end(id, data) {
        const response = await fetch(`${API_URL}/salas/${id}/finalizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al finalizar sala');
        }
        return response.json();
    },

    async getHistory() {
        const response = await fetch(`${API_URL}/historial`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener historial');
        return response.json();
    }
};
