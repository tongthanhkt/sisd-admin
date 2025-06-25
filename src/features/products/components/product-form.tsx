'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { toast } from 'react-hot-toast';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.object({
    main: z.string().optional(),
    thumbnails: z.array(z.string()).optional()
  }),
  packaging: z.string().optional(),
  advantages: z.array(z.string()).optional(),
  technicalSpecifications: z.object({
    standard: z.string().optional(),
    specifications: z
      .array(
        z.object({
          stt: z.number().optional(),
          category: z.string().optional(),
          performance: z.string().optional()
        })
      )
      .optional()
  }),
  transportationAndStorage: z.array(z.string()).optional(),
  safetyRegulations: z.object({
    standard: z.string().optional(),
    specifications: z
      .array(
        z.object({
          stt: z.number().optional(),
          performance: z.string().optional()
        })
      )
      .optional(),
    warning: z.string().optional(),
    notes: z.string().optional()
  })
});

type FormValues = z.infer<typeof formSchema>;

interface FileCardProps {
  imageUrl: string;
  onRemove: () => void;
}

function FileCard({ imageUrl, onRemove }: FileCardProps) {
  return (
    <div className='relative flex items-center space-x-4 rounded-lg border p-4'>
      <div className='relative h-16 w-16 overflow-hidden rounded-md'>
        <Image
          src={imageUrl}
          alt='Product image'
          fill
          className='object-cover'
          sizes='64px'
        />
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-2 right-2 h-8 w-8'
        onClick={onRemove}
      >
        <IconX className='h-4 w-4' />
      </Button>
    </div>
  );
}

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ id: string; url: string }[]>(
    []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      category: initialData?.category || '',
      shortDescription: initialData?.shortDescription || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
      images: {
        main: initialData?.images?.main || '',
        thumbnails: initialData?.images?.thumbnails || []
      },
      packaging: initialData?.packaging || '',
      advantages: initialData?.advantages || [],
      technicalSpecifications: initialData?.technicalSpecifications || {
        standard: '',
        specifications: []
      },
      transportationAndStorage: Array.isArray(
        initialData?.transportationAndStorage
      )
        ? initialData.transportationAndStorage
        : [],
      safetyRegulations: initialData?.safetyRegulations || {
        standard: '',
        specifications: []
      }
    }
  });

  const onSubmit = async (values: FormValues) => {
    console.log('Submitting form', values);
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        image: values.image,
        images: {
          thumbnails: values.images.thumbnails
        },
        technicalSpecifications: values.technicalSpecifications,
        transportationAndStorage: values.transportationAndStorage,
        safetyRegulations: values.safetyRegulations
      };

      let response;
      if (initialData && initialData.id) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${initialData.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        console.log(response);
        throw new Error('Lưu sản phẩm thất bại!');
      }
      toast.success('Lưu sản phẩm thành công!');
      form.reset();
      setPreviewUrls([]);
      setUploadedFiles([]);
      console.log('Submit success');
    } catch (error) {
      console.error('Submit error', error);
      toast.error('Có lỗi xảy ra khi lưu sản phẩm!');
    } finally {
      setIsLoading(false);
    }
  };

  // Set mounted to true after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize preview URLs with existing images
  React.useEffect(() => {
    if (mounted && initialData?.images?.thumbnails?.length) {
      const initialPreviews = initialData.images.thumbnails.map((url) => ({
        id: `existing-${url}`,
        url
      }));
      setPreviewUrls(initialPreviews);
    }
  }, [initialData?.images?.thumbnails, mounted]);

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (mounted) {
        // Only revoke URLs that were created with createObjectURL
        previewUrls.forEach(({ url }) => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [previewUrls, mounted]);

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Main Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={uploadedFiles}
                      onValueChange={async (files) => {
                        if (files && mounted) {
                          try {
                            setIsUploading(true);
                            // Update uploaded files
                            setUploadedFiles(files);

                            // Upload each file and get URLs
                            const filesArray =
                              typeof files === 'function' ? files([]) : files;
                            const uploadPromises = filesArray.map(
                              async (file) => {
                                const result = await uploadFile(file);
                                return {
                                  id: `new-${result.url}`,
                                  url: result.url
                                };
                              }
                            );

                            const newPreviewUrls =
                              await Promise.all(uploadPromises);

                            // Update form value with new URL
                            if (newPreviewUrls.length > 0) {
                              field.onChange(newPreviewUrls[0].url);
                            }

                            // Log the updated image for debugging
                            console.log(
                              'Updated main image:',
                              newPreviewUrls[0]?.url
                            );
                          } catch (error) {
                            console.error('Error uploading file:', error);
                          } finally {
                            setIsUploading(false);
                          }
                        }
                      }}
                      maxFiles={1}
                      maxSize={4 * 1024 * 1024}
                      multiple={false}
                    />
                  </FormControl>
                  {mounted && field.value && field.value !== '' && (
                    <div className='mt-4'>
                      <p className='text-muted-foreground mb-2 text-sm'>
                        Preview:
                      </p>
                      <ScrollArea className='h-fit w-full'>
                        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                          <div className='relative aspect-square'>
                            <Image
                              src={field.value}
                              alt='Main image preview'
                              fill
                              className='rounded-md object-cover'
                            />
                            <Button
                              variant='ghost'
                              size='icon'
                              className='bg-background/80 hover:bg-background/90 absolute top-2 right-2 h-8 w-8'
                              onClick={() => {
                                if (mounted) {
                                  field.onChange(null);
                                  console.log('Cleared main image');
                                }
                              }}
                            >
                              <IconX className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='images.thumbnails'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={uploadedFiles}
                        onValueChange={async (files) => {
                          if (files && mounted) {
                            try {
                              setIsUploading(true);
                              // Update uploaded files
                              setUploadedFiles(files);

                              // Upload each file and get URLs
                              const filesArray =
                                typeof files === 'function' ? files([]) : files;
                              const uploadPromises = filesArray.map(
                                async (file) => {
                                  const result = await uploadFile(file);
                                  return {
                                    id: `new-${result.url}`,
                                    url: result.url
                                  };
                                }
                              );

                              const newPreviewUrls =
                                await Promise.all(uploadPromises);

                              // Combine existing preview URLs with new ones
                              const updatedUrls = [
                                ...previewUrls,
                                ...newPreviewUrls
                              ];
                              setPreviewUrls(updatedUrls);

                              // Update form value with new URLs
                              const currentThumbnails = field.value || [];
                              const newThumbnails = [
                                ...currentThumbnails,
                                ...newPreviewUrls.map((item) => item.url)
                              ];
                              field.onChange(newThumbnails);

                              // Log the updated thumbnails for debugging
                              console.log('Updated thumbnails:', newThumbnails);
                            } catch (error) {
                              console.error('Error uploading files:', error);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        multiple
                      />
                    </FormControl>
                    {mounted && previewUrls.length > 0 && (
                      <div className='mt-4'>
                        <p className='text-muted-foreground mb-2 text-sm'>
                          Preview:
                        </p>
                        <ScrollArea className='h-fit w-full'>
                          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                            {previewUrls.map(({ id, url }) => (
                              <div key={id} className='relative aspect-square'>
                                <Image
                                  src={url}
                                  alt='Preview'
                                  fill
                                  className='rounded-md object-cover'
                                />
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='bg-background/80 hover:bg-background/90 absolute top-2 right-2 h-8 w-8'
                                  onClick={() => {
                                    if (mounted) {
                                      // Remove from preview URLs
                                      const newPreviewUrls = previewUrls.filter(
                                        (item) => item.id !== id
                                      );
                                      setPreviewUrls(newPreviewUrls);

                                      // Remove from form value (thumbnails)
                                      const currentThumbnails =
                                        field.value || [];
                                      const newThumbnails =
                                        currentThumbnails.filter(
                                          (thumbUrl) => thumbUrl !== url
                                        );
                                      field.onChange(newThumbnails);

                                      // Log the updated arrays for debugging
                                      console.log(
                                        'Updated preview URLs:',
                                        newPreviewUrls
                                      );
                                      console.log(
                                        'Updated thumbnails:',
                                        newThumbnails
                                      );

                                      // If it's a blob URL, revoke it
                                      if (url.startsWith('blob:')) {
                                        URL.revokeObjectURL(url);
                                      }
                                    }
                                  }}
                                >
                                  <IconX className='h-4 w-4' />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MORTAL'>Mortal Products</SelectItem>
                        <SelectItem value='TILE'>Tile Products</SelectItem>
                        <SelectItem value='vat-tu-chong-tham'>
                          Waterproofing Materials
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='shortDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter short description' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter product description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='packaging'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Packaging</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter packaging information'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='advantages'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advantages</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      {(field.value || []).map((_, index) => (
                        <div key={index} className='flex gap-2'>
                          <Input
                            placeholder={`Advantage ${index + 1}`}
                            value={(field.value || [])[index]}
                            onChange={(e) => {
                              const newValue = [...(field.value || [])];
                              newValue[index] = e.target.value;
                              field.onChange(newValue);
                            }}
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            onClick={() => {
                              const newValue = (field.value || []).filter(
                                (_, i) => i !== index
                              );
                              field.onChange(newValue);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type='button'
                        onClick={() => {
                          field.onChange([...(field.value || []), '']);
                        }}
                      >
                        Add Advantage
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='technicalSpecifications'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Specifications</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <Input
                        placeholder='Standard'
                        value={field.value.standard}
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            standard: e.target.value
                          });
                        }}
                      />
                      <div className='space-y-2'>
                        {(field.value?.specifications || []).map(
                          (spec, index) => (
                            <div key={index} className='grid grid-cols-3 gap-2'>
                              <Input
                                type='number'
                                placeholder='STT'
                                value={spec.stt}
                                onChange={(e) => {
                                  const newSpecs = [
                                    ...(field.value?.specifications || [])
                                  ];
                                  newSpecs[index] = {
                                    ...spec,
                                    stt: parseInt(e.target.value)
                                  };
                                  field.onChange({
                                    ...field.value,
                                    specifications: newSpecs
                                  });
                                }}
                              />
                              <Input
                                placeholder='Category'
                                value={spec.category}
                                onChange={(e) => {
                                  const newSpecs = [
                                    ...(field.value?.specifications || [])
                                  ];
                                  newSpecs[index] = {
                                    ...spec,
                                    category: e.target.value
                                  };
                                  field.onChange({
                                    ...field.value,
                                    specifications: newSpecs
                                  });
                                }}
                              />
                              <div className='flex gap-2'>
                                <Input
                                  placeholder='Performance'
                                  value={spec.performance}
                                  onChange={(e) => {
                                    const newSpecs = [
                                      ...(field.value?.specifications || [])
                                    ];
                                    newSpecs[index] = {
                                      ...spec,
                                      performance: e.target.value
                                    };
                                    field.onChange({
                                      ...field.value,
                                      specifications: newSpecs
                                    });
                                  }}
                                />
                                <Button
                                  type='button'
                                  variant='destructive'
                                  onClick={() => {
                                    const newSpecs = (
                                      field.value?.specifications || []
                                    ).filter((_, i) => i !== index);
                                    field.onChange({
                                      ...field.value,
                                      specifications: newSpecs
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                        <Button
                          type='button'
                          onClick={() => {
                            field.onChange({
                              ...field.value,
                              specifications: [
                                ...(field.value?.specifications || []),
                                {
                                  stt:
                                    (field.value?.specifications || []).length +
                                    1,
                                  category: '',
                                  performance: ''
                                }
                              ]
                            });
                          }}
                        >
                          Add Specification
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='transportationAndStorage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportation and Storage</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      {(field.value || []).map((_, index) => (
                        <div key={index} className='flex gap-2'>
                          <Input
                            placeholder={`Rule ${index + 1}`}
                            value={(field.value || [])[index]}
                            onChange={(e) => {
                              const newValue = [...(field.value || [])];
                              newValue[index] = e.target.value;
                              field.onChange(newValue);
                            }}
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            onClick={() => {
                              const newValue = (field.value || []).filter(
                                (_, i) => i !== index
                              );
                              field.onChange(newValue);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type='button'
                        onClick={() => {
                          field.onChange([...(field.value || []), '']);
                        }}
                      >
                        Add Rule
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='safetyRegulations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safety Regulations</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <Textarea
                        placeholder='Warning'
                        value={field.value?.warning || ''}
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            warning: e.target.value
                          });
                        }}
                      />
                      <Textarea
                        placeholder='Notes (optional)'
                        value={field.value?.notes || ''}
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            notes: e.target.value
                          });
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button>Save Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
