import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { addSkill } from '../services/db';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const AdminPanel: React.FC = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'Beginner',
      category: 'General',
      steps: [{ title: '', description: '', order: 1 }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps"
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    if (!imageFile) {
      alert("Please select a cover image");
      return;
    }

    setIsLoading(true);
    try {
      // Format steps with IDs
      const formattedSteps = data.steps.map((step: any, index: number) => ({
        ...step,
        id: uuidv4(),
        order: index + 1
      }));

      const skillData = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        category: data.category,
        steps: formattedSteps,
        imageUrl: '', // Will be set by addSkill
        createdAt: Date.now()
      };

      await addSkill(skillData, imageFile);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Skill Module</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <Input
                  label="Skill Title"
                  placeholder="e.g., Basic Electrical Wiring"
                  {...register('title', { required: 'Title is required' })}
                  error={errors.title?.message as string}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Brief description of the skill..."
                    {...register('description', { required: 'Description is required' })}
                  ></textarea>
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      {...register('difficulty')}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <Input
                    label="Category"
                    placeholder="e.g., Electrical"
                    {...register('category', { required: 'Category is required' })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      {imageFile && <p className="text-sm font-medium text-green-600 mt-2">Selected: {imageFile.name}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Training Steps</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={() => append({ title: '', description: '', order: fields.length + 1 })}>
                    <Plus className="w-4 h-4 mr-1" /> Add Step
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                      <div className="absolute top-4 right-4">
                        <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid gap-4 pr-8">
                        <Input
                          label={`Step ${index + 1} Title`}
                          placeholder="e.g., Identify the neutral wire"
                          {...register(`steps.${index}.title` as const, { required: true })}
                        />
                        <Input
                          label="Instruction"
                          placeholder="e.g., Locate the blue wire in the junction box"
                          {...register(`steps.${index}.description` as const, { required: true })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  Create Skill Module
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
