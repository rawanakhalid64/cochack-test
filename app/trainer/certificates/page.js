'use client'

import React, { useState, useEffect } from 'react';
import instance from "../../../utils/axios";

const CertificateManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    url: '',
    issuingOrganization: ''
  });

  // Placeholder image (data URI for a simple gray placeholder)
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23EEEEEE'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' text-anchor='middle' fill='%23999999' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Fetch all certificates
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      
      const response = await instance.get('/api/v1/certificates');
      
      console.log("API Response:", response.data);
      
      // Extract certificates from the response - using the structure we now know
      let certificatesData = [];
      if (response.data && Array.isArray(response.data.certificate)) {
        // API returns { messsage: '...', certificate: [...] }
        certificatesData = response.data.certificate;
      } else if (Array.isArray(response.data)) {
        certificatesData = response.data;
      }
      
      setCertificates(certificatesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setError('Failed to fetch certificates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new certificate
  const createCertificate = async () => {
    try {
      setLoading(true);
      
      const response = await instance.post(
        '/api/v1/certificates',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Certificate created:", response.data);
      
      // After successful creation, refresh the certificates list
      fetchCertificates();
      setError(null);
      setEditMode(false);
      setSelectedCertificate(null);
    } catch (err) {
      console.error("Error creating certificate:", err);
      setError('Failed to create certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update a certificate
  const updateCertificate = async (certificateId) => {
    try {
      setLoading(true);
      
      const response = await instance.patch(
        `/api/v1/certificates/${certificateId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Certificate updated:", response.data);
      
      // After successful update, refresh the certificates list
      fetchCertificates();
      setError(null);
      setEditMode(false);
      setSelectedCertificate(null);
    } catch (err) {
      console.error("Error updating certificate:", err);
      setError('Failed to update certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCertificate && selectedCertificate.credintialId) {
      updateCertificate(selectedCertificate.credintialId);
    } else {
      // If no certificate is selected, create a new one
      createCertificate();
    }
  };

  // Select a certificate for editing
  const handleSelectCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setFormData({
      name: certificate.name || '',
      imageUrl: certificate.imageUrl || '',
      url: certificate.url || '',
      issuingOrganization: certificate.issuingOrganization || ''
    });
    setEditMode(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setSelectedCertificate(null);
    setFormData({
      name: '',
      imageUrl: '',
      url: '',
      issuingOrganization: ''
    });
  };

  // Add new certificate button handler
  const handleAddNew = () => {
    setSelectedCertificate(null);
    setFormData({
      name: '',
      imageUrl: '',
      url: '',
      issuingOrganization: ''
    });
    setEditMode(true);
  };

  // Fetch certificates on component mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Certificates</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading && !editMode ? (
        <div className="flex justify-center">
          <p>Loading certificates...</p>
        </div>
      ) : (
        <>
          {!editMode ? (
            <div>
              <div className="mb-6">
                <button
                  onClick={handleAddNew}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                  Add New Certificate
                </button>
              </div>
              
              {!Array.isArray(certificates) || certificates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4">No certificates found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.credintialId} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                      {cert.imageUrl && (
                        <div className="mb-3">
                          <img 
                            src={cert.imageUrl} 
                            alt={cert.name} 
                            className="w-full h-40 object-contain"
                            onError={(e) => {e.target.src = placeholderImage; e.target.alt = "Certificate image not available"}}
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-lg">{cert.name}</h3>
                      <p className="text-gray-600">{cert.issuingOrganization}</p>
                      
                      {cert.url && (
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Certificate
                        </a>
                      )}
                      
                      <div className="mt-4">
                        <button
                          onClick={() => handleSelectCertificate(cert)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                {selectedCertificate ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Certificate Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
                    Image URL
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
                    Certificate URL
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="text"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="issuingOrganization">
                    Issuing Organization
                  </label>
                  <input
                    id="issuingOrganization"
                    name="issuingOrganization"
                    type="text"
                    value={formData.issuingOrganization}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                {formData.imageUrl && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold mb-2">Preview</h3>
                    <img 
                      src={formData.imageUrl} 
                      alt="Certificate Preview" 
                      className="w-full h-40 object-contain border"
                      onError={(e) => {e.target.src = placeholderImage; e.target.alt = "Image preview not available"}}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                  >
                    {loading ? (selectedCertificate ? 'Saving...' : 'Creating...') : (selectedCertificate ? 'Save Changes' : 'Create Certificate')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CertificateManager;