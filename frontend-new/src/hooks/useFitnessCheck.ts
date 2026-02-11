import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Room, PlacedFurniture } from '../types';

export interface FitnessResult {
    all_fits: boolean;
    results: {
        furniture_id: number;
        instance_id?: number;
        furniture_name: string;
        fits: boolean;
        collisions: string[];
        adequate_space: boolean;
        walking_space_x: number;
        walking_space_y: number;
        message: string;
    }[];
    overall_message: string;
}

export const useFitnessCheck = () => {
    const [fitnessResult, setFitnessResult] = useState<FitnessResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [fitnessModalVisible, setFitnessModalVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkFitness = async (room: Room, placedFurniture: PlacedFurniture[]) => {
        if (placedFurniture.length === 0) {
            setError('Place some furniture items first before running a fitness check.');
            return;
        }

        const requestData = {
            room_id: room.id,
            furniture_items: placedFurniture.map(item => ({
                furniture_id: item.furniture.id,
                instance_id: item.id, // Send the unique instance ID
                position_x: item.position.x,
                position_y: item.position.y,
                rotation: item.rotation,
            })),
        };

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`${API_BASE_URL}/check-multiple-fitness`, requestData);
            setFitnessResult(response.data);
            setFitnessModalVisible(true);
        } catch (err: any) {
            console.error('Fitness Check Error:', err);
            const errorMessage = err.response?.data?.detail || 'Unable to check fitness. Make sure the backend is running.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const closeFitnessModal = () => {
        setFitnessModalVisible(false);
        setFitnessResult(null);
    };

    const clearError = () => setError(null);

    return {
        fitnessResult,
        loading,
        fitnessModalVisible,
        error,
        checkFitness,
        closeFitnessModal,
        clearError,
    };
};
